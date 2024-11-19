import { useState, useEffect } from "react";

function useMultiTableDB() {
    const dbName = 'multiTableDB';
    const [tables, setTables] = useState({
        kategori: [
            { id: 1, name: "Internal (Satker)" },
            { id: 2, name: "Eksternal (Bank Umum)" },
            { id: 3, name: "Eksternal (BPR)" },
            { id: 4, name: "Eksternal (Masyarakat)" },
        ],
        users: [
            {
                id: 0,
                name: "Admin",
                email: "admin@admin.com",
                password: "admin",
                "kategoriId": 0
            }, {
                "id": 1,
                "name": "BPR Surya Kencana",
                "email": "surya@bpr.com",
                "password": "surya123",
                "kategoriId": 3
            },
            {
                "id": 2,
                "name": "BPR Mitra Sejahtera",
                "email": "mitra@bpr.com",
                "password": "mitra456",
                "kategoriId": 3
            },
            {
                "id": 3,
                "name": "Bank Mandiri",
                "email": "mandiri@bank.com",
                "password": "mandiri123",
                "kategoriId": 2
            },
            {
                "id": 4,
                "name": "Bank BCA",
                "email": "bca@bank.com",
                "password": "bca456",
                "kategoriId": 2
            },
            {
                "id": 5,
                "name": "Bank BRI",
                "email": "bri@bank.com",
                "password": "bri789",
                "kategoriId": 2
            },
            {
                "id": 6,
                "name": "Bank BTN",
                "email": "btn@bank.com",
                "password": "btn321",
                "kategoriId": 2
            },
            {
                "id": 7,
                "name": "Bank CIMB Niaga",
                "email": "cimb@bank.com",
                "password": "cimb1234",
                "kategoriId": 2
            },
            {
                "id": 8,
                "name": "Ahmad Dani",
                "email": "dani@maya.com",
                "password": "danimaya",
                "kategoriId": 4
            },
            {
                id: 9,
                name: "DPKG",
                email: "dpkg.com",
                password: "DPKG",
                kategoriId: 1
            },
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