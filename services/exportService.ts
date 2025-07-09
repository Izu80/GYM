import { DailyLog, SetLog, Feeling } from '../types';

// This function relies on the SheetJS library (XLSX) being loaded globally,
// for example, via a <script> tag in index.html.
declare var XLSX: any;

interface ExcelRow {
  Semana: number;
  Día: string;
  Fecha: string;
  Ejercicio: string;
  'Set #': number;
  Reps: number | string;
  Sensación: Feeling | string;
}

export const exportWeekToExcel = (weekNumber: number, weeklyLogs: { [day: string]: DailyLog }): void => {
  if (!weeklyLogs || Object.keys(weeklyLogs).length === 0) {
    alert("No hay datos de entrenamiento para exportar.");
    return;
  }

  const dataForExcel: ExcelRow[] = [];
  
  // Sort days of the week to ensure order in Excel
  const sortedDays = Object.keys(weeklyLogs).sort((a, b) => {
      const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
  });

  for (const day of sortedDays) {
    const dailyLog = weeklyLogs[day];
    if (dailyLog && dailyLog.exercises) {
        dailyLog.exercises.forEach((exercise) => {
          exercise.sets.forEach((set: SetLog, index: number) => {
            if (set.completed) { // Only export completed sets
                dataForExcel.push({
                    Semana: dailyLog.week,
                    Día: dailyLog.day,
                    Fecha: new Date(dailyLog.date).toLocaleDateString(),
                    Ejercicio: exercise.name,
                    'Set #': index + 1,
                    Reps: set.reps ?? 'N/A',
                    Sensación: set.feeling ?? 'N/A',
                });
            }
          });
        });
    }
  }

  if (dataForExcel.length === 0) {
      alert("No hay series completadas en la semana para exportar.");
      return;
  }

  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Semana ${weekNumber}`);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 10 }, // Semana
    { wch: 15 }, // Día
    { wch: 15 }, // Fecha
    { wch: 30 }, // Ejercicio
    { wch: 10 }, // Set #
    { wch: 10 }, // Reps
    { wch: 15 }, // Sensación
  ];

  XLSX.writeFile(workbook, `Entrenamiento_Semana_${weekNumber}.xlsx`);
};
