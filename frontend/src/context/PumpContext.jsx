import React, { createContext, useContext, useState } from 'react';

const PumpContext = createContext(null);

/* ==========================================
   INITIAL MOCK DATA
   ========================================== */

const initialPumps = [
    {
        id: 1,
        pumpNo: 'P-9923',
        name: 'Station Alpha-01',
        location: 'Downtown Hub',
        status: 'Active',
        admin: {
            name: 'John Doe',
            email: 'john.doe@cngpump.com',
            initials: 'JD',
            assigned: true,
            lastLogin: 'Today, 09:41 AM'
        },
        dateCommissioned: 'Oct 12, 2023',
    },
    {
        id: 2,
        pumpNo: 'P-8812',
        name: 'Station Beta-04',
        location: 'Northside Industrial',
        status: 'Active',
        admin: {
            name: 'Sarah Allen',
            email: 's.allen@cngpump.com',
            initials: 'SA',
            assigned: true,
            lastLogin: 'Yesterday, 14:20 PM'
        },
        dateCommissioned: 'Nov 05, 2023',
    },
    {
        id: 3,
        pumpNo: 'P-4451',
        name: 'Station Gamma-02',
        location: 'West Valley',
        status: 'Inactive',
        admin: {
            name: 'Mike Ross',
            email: 'm.ross@cngpump.com',
            initials: 'MR',
            assigned: false,
            lastLogin: 'Never'
        },
        dateCommissioned: 'Jan 22, 2022',
    },
];


/* ==========================================
   PUMP PROVIDER
   ========================================== */

export const PumpProvider = ({ children }) => {

    /*
     * Mock data se state initialize hogi.
     *
     * Page refresh hone par React dobara mount hoga
     * aur initialPumps se fresh data load hoga.
     */
    const [pumps, setPumps] = useState(initialPumps);


    /* ==========================================
       ADD NEW PUMP
       ========================================== */

    const addNewPump = (formData) => {

        const hasAdmin = Boolean(
            formData.adminName &&
            formData.adminName.trim() !== ''
        );


        const newPump = {
            id: Date.now(),

            pumpNo: `P-${Math.floor(
                1000 + Math.random() * 9000
            )}`,

            name: formData.pumpName,

            location: formData.pumpAddress,

            status: 'Active',

            admin: {
                name: formData.adminName || '',

                email: formData.email || '',

                initials: hasAdmin
                    ? formData.adminName
                        .trim()
                        .split(/\s+/)
                        .map((name) => name[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : '',

                assigned: hasAdmin,

                lastLogin: 'Just now'
            },

            dateCommissioned: new Date().toLocaleDateString(
                'en-US',
                {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                }
            ),
        };


        /*
         * New pump list ke beginning mein add hoga.
         */
        setPumps((prevPumps) => [
            newPump,
            ...prevPumps
        ]);
    };


    /* ==========================================
       REMOVE PUMP
       ========================================== */

    const removePump = (id) => {

        setPumps((prevPumps) =>
            prevPumps.filter(
                (pump) => pump.id !== id
            )
        );
    };


    /* ==========================================
       CONTEXT VALUE
       ========================================== */

    return (
        <PumpContext.Provider
            value={{
                pumps,
                addNewPump,
                removePump,
            }}
        >
            {children}
        </PumpContext.Provider>
    );
};


/* ==========================================
   CUSTOM HOOK
   ========================================== */

export const usePumps = () => {

    const context = useContext(PumpContext);

    if (!context) {
        throw new Error(
            'usePumps must be used within a PumpProvider'
        );
    }

    return context;
};