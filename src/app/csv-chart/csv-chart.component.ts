import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

interface DatosCSV {
  FECHA: string;
  EMPRESA: string;
  TABLA: string;
  Seus: number;
  Aurora: number;
  Salesforce: number;
}

@Component({
  selector: 'app-csv-chart',
  templateUrl: './csv-chart.component.html',
  styleUrls: ['./csv-chart.component.scss']
})
export class CsvChartComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('basicBarChart') basicBarChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;

  // Datos precargados
  datosCsv: DatosCSV[] = [
    { FECHA: "2025-03-17", EMPRESA: "JA", TABLA: "NOT_COTIZACIONES_ENC", Seus: 12, Aurora: 10, Salesforce: 7 },
    { FECHA: "2025-03-17", EMPRESA: "JA", TABLA: "REM_ENC", Seus: 9, Aurora: 9, Salesforce: 9 },
    { FECHA: "2025-03-17", EMPRESA: "JA", TABLA: "CART_ENC", Seus: 4, Aurora: 4, Salesforce: 4 },
    { FECHA: "2025-03-17", EMPRESA: "JA", TABLA: "FAC_ENC", Seus: 220, Aurora: 1, Salesforce: 2 },
    { FECHA: "2025-03-17", EMPRESA: "JA", TABLA: "MIEMBROS_COMPL", Seus: 75, Aurora: 30, Salesforce: 0 },
    { FECHA: "2025-03-17", EMPRESA: "JP", TABLA: "NOT_COTIZACIONES_ENC", Seus: 2, Aurora: 1, Salesforce: 1 },
    { FECHA: "2025-03-17", EMPRESA: "JP", TABLA: "REM_ENC", Seus: 1, Aurora: 1, Salesforce: 1 },
    { FECHA: "2025-03-17", EMPRESA: "JP", TABLA: "CART_ENC", Seus: 0, Aurora: 0, Salesforce: 0 },
    { FECHA: "2025-03-17", EMPRESA: "JP", TABLA: "FAC_ENC", Seus: 2, Aurora: 2, Salesforce: 0 },
    { FECHA: "2025-03-17", EMPRESA: "JP", TABLA: "MIEMBROS_COMPL", Seus: 30, Aurora: 4, Salesforce: 0 }
  ];

  empresas: string[] = [];
  tablas: string[] = [];
  empresaSeleccionada = '';
  tablaSeleccionada = '';
  charts: any = {};
  dataCargada = false;

  // Nueva propiedad para el rango de tiempo seleccionado
  rangoTiempoSeleccionado = '30'; // Por defecto, últimos 30 días

  // Propiedades para los porcentajes de los círculos de progreso
  auroraPercentage = 0;
  salesforcePercentage = 0;

  constructor() {}

  ngOnInit(): void {
    // Extraer empresas y tablas únicas
    this.empresas = [...new Set(this.datosCsv.map(item => item.EMPRESA))];
    this.tablas = [...new Set(this.datosCsv.map(item => item.TABLA))];

    // Establecer selecciones iniciales
    this.empresaSeleccionada = this.empresas[0];
    this.tablaSeleccionada = this.tablas[0];
    this.dataCargada = true;
  }

  ngAfterViewInit() {
    // Asegurarnos de que los elementos del DOM estén disponibles antes de renderizar
    setTimeout(() => {
      this.renderizarGrafica();
    }, 100);
  }

  cambiarEmpresa(event: any) {
    this.empresaSeleccionada = event.target.value;
    this.renderizarGrafica();
  }

  cambiarTabla(event: any) {
    this.tablaSeleccionada = event.target.value;
    this.renderizarGrafica();
  }

  // Método para filtrar datos por rango de tiempo
  private filtrarPorTiempo(datos: DatosCSV[], rangoDias: number): DatosCSV[] {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - rangoDias);

    return datos.filter(item => {
      const fechaItem = new Date(item.FECHA);
      return fechaItem >= fechaLimite;
    });
  }

  // Método para manejar el cambio de rango de tiempo
  cambiarRangoTiempo(event: any) {
    this.rangoTiempoSeleccionado = event.target.value;
    this.renderizarGrafica();
  }

  renderizarGrafica() {
    // Destruir gráficas existentes
    if (this.charts.barChart) {
      this.charts.barChart.destroy();
    }
    if (this.charts.basicBarChart) {
      this.charts.basicBarChart.destroy();
    }
    if (this.charts.lineChart) {
      this.charts.lineChart.destroy();
    }

    // Filtrar datos según empresa, tabla y rango de tiempo seleccionados
    let datosFiltrados = this.datosCsv.filter(item =>
      (!this.empresaSeleccionada || item.EMPRESA === this.empresaSeleccionada) &&
      (!this.tablaSeleccionada || item.TABLA === this.tablaSeleccionada)
    );

    datosFiltrados = this.filtrarPorTiempo(datosFiltrados, parseInt(this.rangoTiempoSeleccionado, 10));

    const labels = ['Seus', 'Aurora', 'Salesforce'];
    const datosPromedio = {
      Seus: 0,
      Aurora: 0,
      Salesforce: 0
    };

    datosFiltrados.forEach(item => {
      datosPromedio.Seus += item.Seus;
      datosPromedio.Aurora += item.Aurora;
      datosPromedio.Salesforce += item.Salesforce;
    });

    if (datosFiltrados.length > 0) {
      datosPromedio.Seus /= datosFiltrados.length;
      datosPromedio.Aurora /= datosFiltrados.length;
      datosPromedio.Salesforce /= datosFiltrados.length;
    }

    // Calcular porcentajes para los círculos de progreso
    const totalSeus = datosPromedio.Seus || 1; // Evitar división por cero
    this.auroraPercentage = (datosPromedio.Aurora / totalSeus) * 100;
    this.salesforcePercentage = (datosPromedio.Salesforce / totalSeus) * 100;

    const datasets = [
      {
        label: 'Conteo',
        data: [datosPromedio.Seus, datosPromedio.Aurora, datosPromedio.Salesforce],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ];

    const chartTitle = `Datos para ${this.empresaSeleccionada || 'Todas las empresas'} - ${this.tablaSeleccionada || 'Todas las tablas'}`;

    // Gráfica de barras básica
    const basicBarCtx = this.basicBarChart.nativeElement.getContext('2d');
    this.charts.basicBarChart = new Chart(basicBarCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Gráfico de Barras Básico'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Gráfica de barras
    const barCtx = this.barChart.nativeElement.getContext('2d');
    this.charts.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: chartTitle
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Gráfica de rosquilla
    const doughnutCtx = this.lineChart.nativeElement.getContext('2d');
    this.charts.lineChart = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: chartTitle
          }
        }
      }
    });
  }
}