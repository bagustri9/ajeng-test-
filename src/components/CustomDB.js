import { useState, useEffect } from "react";

function useMultiTableDB() {
    const dbName = 'multiTableDB';
    const [tables, setTables] = useState({
        users: [],
        rpojk: [],
        baris: []
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
    const saveTables = (newTables) => {
        setTables(newTables);
        localStorage.setItem(dbName, JSON.stringify(newTables));
    };

    // Export database to file
    const exportDB = () => {
        const blob = new Blob([JSON.stringify(tables, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'database.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Import database from file
    const importDB = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newData = JSON.parse(e.target.result);
                setTables(newData);
                localStorage.setItem(dbName, JSON.stringify(newData));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error loading database file');
            }
        };
        reader.readAsText(file);
    };

    // CRUD operations for any table
    const create = (tableName, item) => {
        const newTables = {
            ...tables,
            [tableName]: [...tables[tableName], { id: Date.now(), ...item }]
        };
        saveTables(newTables);
    };

    const read = (tableName, id) => {
        return tables[tableName].find(item => item.id === id);
    };

    const update = (tableName, id, updates) => {
        const newTables = {
            ...tables,
            [tableName]: tables[tableName].map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        };
        saveTables(newTables);
    };

    const remove = (tableName, id) => {
        const newTables = {
            ...tables,
            [tableName]: tables[tableName].filter(item => item.id !== id)
        };
        saveTables(newTables);
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
        update,
        remove,
        getRelated,
        importDB,
        exportDB
    };
};

export default useMultiTableDB;