import { makeAutoObservable } from 'mobx';
import axios from 'axios';

const API = "https://gateway.scan-interfax.ru";

class AuthStore {
    token = null;
    userData = null;
    documentIDs = [];
    documents = [];
    loading = false;
    summaryResult = null;
    summaryError = null;

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    


    async getToken(login, password) {
        try {
            const response = await axios.post(`${API}/api/v1/account/login`, {
                login: login.trim(),
                password: password.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (response.data && response.data.accessToken) {
                this.setToken(response.data.accessToken);
                console.log('Токен успешно получен:', this.token);
                await this.getUserData(); 
            }
        } catch (error) {
            console.error('Ошибка при получении токена:', error);
            if (error.response) {
                console.error('Код состояния:', error.response.status);
                console.error('Данные ответа:', error.response.data);
                if (error.response.status === 401) {
                    console.error('Неверные учетные данные.');
                }
            } else {
                console.error('Ошибка сети или сервера', error.message);
            }
        }
    }

    async getUserData() {
        if (!this.token) {
            console.error('Токен не доступен, пользователь не авторизован.');
            return;
        }

        try {
            this.setLoading(true);
            await this.simulateDelay(5000);
            const response = await axios.get(`${API}/api/v1/account/info`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                }
            });

            if (response.data) {
                this.setUserData(response.data);
            }
        } catch (error) {
            this.handleRequestError(error);
        } finally {
            this.setLoading(false);  
        }
    }

    createSearchParameters(formData) {
        this.setSummaryLoading(true);
        try {
            const { innCompany, sparkId, entityId, startDate, endDate, maxRelevance, businessContext, mainRole, tonality, riskFactors, technicalNews, announcements, newsSummaries, documentsCount } = formData;

            if (!innCompany && !sparkId && !entityId) {
                throw new Error("Ошибки: Должно быть указано хотя бы одно из следующих полей: innCompany, sparkId, entityId.");
            }

            return {
                issueDateInterval: {
                    startDate,
                    endDate,
                },
                searchContext: {
                    targetSearchEntitiesContext: {
                        targetSearchEntities: [
                            {
                                type: "company",
                                sparkId: sparkId || null,
                                entityId: entityId || null,
                                inn: innCompany || null,
                                maxFullness: maxRelevance,
                                inBusinessNews: businessContext,
                            },
                        ],
                        onlyMainRole: mainRole || false,
                        tonality: tonality || "any",
                        onlyWithRiskFactors: riskFactors,
                        riskFactors: {
                            and: [],
                            or: [],
                            not: [],
                        },
                        themes: {
                            and: [],
                            or: [],
                            not: [],
                        },
                    },
                    themesFilter: {
                        and: [],
                        or: [],
                        not: [],
                    },
                },
                searchArea: {
                    includedSources: [],
                    excludedSources: [],
                    includedSourceGroups: [],
                    excludedSourceGroups: [],
                },
                attributeFilters: {
                    excludeTechNews: technicalNews,
                    excludeAnnouncements: announcements,
                    excludeDigests: newsSummaries,
                },
                similarMode: "duplicates",
                limit: documentsCount,
                sortType: "issueDate",
                sortDirectionType: "desc",
                intervalType: "day",
                histogramTypes: ["totalDocuments", "riskFactors"],
            };
        } catch (error) {
            console.error(error.message);
            this.setSummaryLoading(false);
            return null;
        }
    }

    async searchHistogram(formData) {
        this.setLoading(true);
        const requestData = this.createSearchParameters(formData);

        if (!requestData) {
            this.setLoading(false);
            return null;
        }

        try {
            const response = await axios.post(`${API}/api/v1/objectsearch/histograms`, requestData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });
            console.log('Histogram response:', response);

            if (response.status === 200 && response.data && response.data.data && response.data.data.length !== 0) {
                this.setSummaryResult(response.data);
                this.setSummaryError(false);
                return response.data;
            } else {
                this.setSummaryError(true);
                return null;
            }
        } catch (error) {
            this.setSummaryError(true);
            this.handleRequestError(error);
            return null;
        } finally {
            this.setLoading(false);
        }
    }

    async getDocumentIds(formData) {
        const requestData = this.createSearchParameters(formData);

        if (!requestData) {
            return [];
        }

        try {
            const response = await axios.post(`${API}/api/v1/objectsearch`, requestData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response from getDocumentIds:', response);

            if (response.data && response.data.items) {
                const documentIDs = response.data.items.map(item => item.encodedId);
                console.log('Полученные ID документов:', documentIDs);
                this.setDocumentIDs(documentIDs);
                return documentIDs;
            } else {
                return [];
            }
        } catch (error) {
            this.handleRequestError(error);
            return [];
        }
    }

    async getDocumentsByIds(documentIds) {
        const requestData = { ids: documentIds };

        try {
            const response = await axios.post(`${API}/api/v1/documents`, requestData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response from getDocumentsByIds:', response);

            const documents = response.data;

            if (Array.isArray(documents) && documents.length > 0) {
                console.log('Documents data:', documents);
                return documents;
            } else {
                console.warn('Документы не найдены в ответе или ответ пуст');
                return [];
            }
        } catch (error) {
            this.handleRequestError(error);
            return [];
        }
    }

    async searchDocuments(formData) {
        const documentIds = await this.getDocumentIds(formData);
        console.log('Полученные ID для поиска документов:', documentIds);

        if (!documentIds || documentIds.length === 0) {
            console.warn('Нет доступных ID для поиска документов');
            return [];
        }

        const documents = await this.getDocumentsByIds(documentIds);
        console.log('Полученные документы:', documents);

        if (documents && documents.length > 0) {
            return documents;
        } else {
            return [];
        }
    }

    async searchAll(formData) {
        this.setSummaryLoading(true);

        try {
            const histogramResult = await this.searchHistogram(formData);
            const documentsResult = await this.searchDocuments(formData);
            this.setSummaryLoading(false);

            return { histogramResult, documentsResult };
        } catch (error) {
            console.error('Ошибка при совместном поиске гистограмм и документов:', error);
            this.setSummaryLoading(false);
            return null;
        }
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('accessToken', token);
    }

    setUserData(userData) {
        this.userData = userData;
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    setDocumentIDs(documentIDs) {
        this.documentIDs = documentIDs;
    }

    setDocuments(documents) {
        this.documents = documents;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setSummaryResult(result) {
        this.summaryResult = result;
    }

    setSummaryError(error) {
        this.summaryError = error;
    }

    setSummaryLoading(state) {
        this.summaryLoading = state;
    }

    loadFromLocalStorage() {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');

        if (token) {
            this.setToken(token);
        }

        if (userData) {
            this.setUserData(JSON.parse(userData));
        }
    }

    logout() {
        this.token = null;
        this.userData = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
    }

    checkAuth() {
        return this.token !== null;
    }

    handleRequestError(error) {
        console.error('Ошибка сети или сервера', error.message);

        if (error.response) {
            console.error('Код состояния:', error.response.status);
            console.error('Данные ответа:', error.response.data);
        }
    }
}

const store = new AuthStore();

export default store;