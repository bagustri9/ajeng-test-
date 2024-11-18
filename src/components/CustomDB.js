import { useState, useEffect } from "react";

function useMultiTableDB() {
    const dbName = 'multiTableDB';
    const [tables, setTables] = useState({
        users: [
            {
                id: 0,
                name: "Admin",
                email: "admin@admin.com",
                password: "admin"
            },
            {
                id: 1,
                name: "Bank Umum",
                email: "bank@umum.com",
                password: "bank"
            },
            {
                id: 2,
                name: "Bank Privat",
                email: "bank@privat.com",
                password: "bank"
            }
        ],
        rpojk: [],
        baris: [],
        responseRpojk: [],
        responseBaris: [],
        notification: []
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(dbName);
        if (stored) {
            setTables(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    // Save all tables
    useEffect(() => {
        if (isLoaded) {  // Only save after initial load
            localStorage.setItem(dbName, JSON.stringify(tables));
        }
    }, [tables, isLoaded]);

    // CRUD operations for any table
    const create = (tableName, item) => {
        const newData = { id: crypto.randomUUID(), ...item }
        setTables(prevTables => ({
            ...prevTables,
            [tableName]: [...prevTables[tableName], newData]
        }));
        return newData;
    };

    const read = (tableName, id) => {
        var data = localStorage.getItem(dbName)
        if (data == "") {
            return null
        }
        return JSON.parse(data)[tableName].find(item => item.id === id);
    };

    const readAll = (tableName) => {
        var data = localStorage.getItem(dbName)
        if (data == "") {
            return []
        }
        return JSON.parse(data)[tableName];
    };

    const update = (tableName, id, updates) => {
        setTables(prevTables => ({
            ...prevTables,
            [tableName]: prevTables[tableName].map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        }));
    };

    const remove = (tableName, id) => {
        setTables(prevTables => ({
            ...prevTables,
            [tableName]: prevTables[tableName].filter(item => item.id !== id)
        }));
    };

    // Get related records
    const getRelated = (tableName, foreignKey, foreignKeyValue) => {
        return tables[tableName].filter(item => item[foreignKey] === foreignKeyValue);
    };

    return {
        tables,
        isLoaded,
        create,
        read,
        readAll,
        update,
        remove,
        getRelated
    };
};

export default useMultiTableDB;