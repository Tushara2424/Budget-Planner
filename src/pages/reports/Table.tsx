import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../Firebase";
import {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import "./Table.css"

interface Column {
    id: 'index' | 'category' | 'description' | 'date' | 'amount';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'index', label: 'Index', minWidth: 50 },
    { id: 'category', label: 'Category', minWidth: 150 },
    {
        id: 'description',
        label: 'Description',
        minWidth: 150,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'date',
        label: 'Date',
        minWidth: 100,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 100,
        align: 'left',
        format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    key: number;
    index: number;
    category: string;
    description: number;
    date: number;
    amount: number;
}

function createData(
    key: number,
    index: number,
    category: string,
    description: number,
    date: number,
    amount: number,
): Data {
    return { key: key, index: index, category: category, description: description, date: date, amount: amount };
}

export default function StickyHeadTable(props: any) {
    const [user, loading] = useAuthState(auth);
    const [rowsData, setRowsData] = useState<Data[]>([]);
    const [repDataReady, setRepDataReady] = useState(false);
    let userId:any;

    useEffect(() => {
        if (loading) {
            return;
        }
        userId = user?.uid;
        const expensesRef = ref(db, `users/${userId}/expenses`);
        onValue(expensesRef, (snapshot) => {
            const expensesRow = snapshot.val();
            let index = 1;
            let row: Data [] = [];
            for (const id in expensesRow) {
                const rowData = expensesRow[id];
                const ts = Date.parse(rowData["date"]);
                const startTs = Date.parse(props.data.startDate);
                const endTs = Date.parse(props.data.endDate);
                if (ts >= startTs && ts <= endTs) {
                    row.push(createData(Number(id), index++, rowData["category"], rowData["description"], rowData["date"], rowData["amount"]));
                }
            }
            setRowsData(row);
            setRepDataReady(true);
        });
    }, [loading, props]);


    if (props.data.reportType != "expenses-table") {
        return (<></>);
    }

    return  (
        <>
            {!repDataReady ? (<></>) : (
            <div className="table-div">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowsData
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
            )}
        </>
    );
}
