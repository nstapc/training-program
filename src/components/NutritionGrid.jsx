import React, { useState, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

const initialRows = [
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    food: '',
    qty: 1,
    unit: 'serving',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  }
];

const columns = [
  {
    key: 'date',
    name: 'Date',
    width: 120,
    editable: true
  },
  {
    key: 'food',
    name: 'Food',
    width: 200,
    editable: true
  },
  {
    key: 'qty',
    name: 'Qty',
    width: 80,
    editable: true
  },
  {
    key: 'unit',
    name: 'Unit',
    width: 100,
    editable: true
  },
  {
    key: 'calories',
    name: 'Calories',
    width: 100,
    editable: false
  },
  {
    key: 'protein',
    name: 'Protein (g)',
    width: 100,
    editable: false
  },
  {
    key: 'carbs',
    name: 'Carbs (g)',
    width: 100,
    editable: false
  },
  {
    key: 'fat',
    name: 'Fat (g)',
    width: 100,
    editable: false
  },
  {
    key: 'fiber',
    name: 'Fiber (g)',
    width: 100,
    editable: false
  }
];

const NutritionGrid = () => {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('nutritionRows');
    return saved ? JSON.parse(saved) : initialRows;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('nutritionRows', JSON.stringify(rows));
  }, [rows]);

  const handleCellChange = async (rowIndex, columnKey, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnKey]: value };
    setRows(newRows);

    // Auto-fill nutrition data when food name is entered
    if (columnKey === 'food' && value.trim()) {
      await fetchNutritionData(rowIndex, value.trim());
    }
  };

  const fetchNutritionData = async (rowIndex, foodName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data');
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      const newRows = [...rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        fiber: data.fiber || 0
      };
      setRows(newRows);
    } catch (err) {
      setError('Error fetching nutrition data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      food: '',
      qty: 1,
      unit: 'serving',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rowIndex) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, index) => index !== rowIndex);
      setRows(newRows);
    }
  };

  const totals = rows.reduce(
    (acc, row) => {
      const qty = parseFloat(row.qty) || 1;
      return {
        calories: acc.calories + (row.calories * qty),
        protein: acc.protein + (row.protein * qty),
        carbs: acc.carbs + (row.carbs * qty),
        fat: acc.fat + (row.fat * qty),
        fiber: acc.fiber + (row.fiber * qty)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const renderCell = ({ row, column, onRowChange }) => {
    const value = row[column.key];
    
    if (column.editable === false) {
      return <div className="rdg-cell-value">{value}</div>;
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
        onBlur={() => {
          if (column.key === 'food' && value.trim()) {
            fetchNutritionData(rows.indexOf(row), value.trim());
          }
        }}
        className="w-full h-full border-none outline-none bg-transparent"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nutrition Log</h2>
        <div className="space-x-2">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Row
          </button>
          <button
            onClick={() => setRows(initialRows)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={(row) => row.id}
          onRowsChange={setRows}
          renderers={{
            renderCell
          }}
          className="rdg-light"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Daily Totals</h3>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(totals.calories)}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{totals.protein.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Protein (g)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{totals.carbs.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Carbs (g)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{totals.fat.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Fat (g)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{totals.fiber.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Fiber (g)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionGrid;