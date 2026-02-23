import type { ChartConfiguration, ChartDataset, ChartType } from "chart.js";

/**
 * Fluent builder for Chart.js configurations.
 * Encapsulates all dark-theme defaults so chart components stay declarative.
 */
export class ChartConfigBuilder<T extends ChartType = ChartType> {
  private config: ChartConfiguration<T>;

  constructor(type: T) {
    this.config = {
      type,
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 }, // GSAP handles mount animation
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#a1a1aa",
              font: { family: "Inter, sans-serif", size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: "#262626",
            titleColor: "#f4f4f5",
            bodyColor: "#a1a1aa",
            borderColor: "#3f3f46",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {},
      },
    } as unknown as ChartConfiguration<T>;
  }

  withLabels(labels: string[]): this {
    this.config.data.labels = labels;
    return this;
  }

  withDataset(dataset: ChartDataset<T>): this {
    this.config.data.datasets.push(dataset);
    return this;
  }

  withTitle(text: string): this {
    if (this.config.options?.plugins) {
      (this.config.options.plugins as Record<string, unknown>).title = {
        display: true,
        text,
        color: "#f4f4f5",
        font: { family: "Inter, sans-serif", size: 14, weight: "bold" },
        padding: { bottom: 16 },
      };
    }
    return this;
  }

  withCartesianScales(): this {
    if (this.config.options) {
      (this.config.options as Record<string, unknown>).scales = {
        x: {
          grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
          ticks: { color: "#71717a", font: { family: "Inter" } },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
          ticks: { color: "#71717a", font: { family: "Inter" } },
          beginAtZero: true,
        },
      };
    }
    return this;
  }

  withNoLegend(): this {
    if (this.config.options?.plugins?.legend) {
      this.config.options.plugins.legend.display = false;
    }
    return this;
  }

  build(): ChartConfiguration<T> {
    return this.config;
  }

  // ---- Static factory helpers ----

  static lineChart(
    labels: string[],
    data: number[],
    label: string,
  ): ChartConfiguration<"line"> {
    return new ChartConfigBuilder("line")
      .withLabels(labels)
      .withDataset({
        label,
        data,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3B82F6",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      } as ChartDataset<"line">)
      .withCartesianScales()
      .build();
  }

  static barChart(
    labels: string[],
    data: number[],
    label: string,
  ): ChartConfiguration<"bar"> {
    return new ChartConfigBuilder("bar")
      .withLabels(labels)
      .withDataset({
        label,
        data,
        backgroundColor: "rgba(59,130,246,0.7)",
        borderColor: "#3B82F6",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#3B82F6",
      } as ChartDataset<"bar">)
      .withCartesianScales()
      .build();
  }

  static doughnutChart(
    labels: string[],
    data: number[],
  ): ChartConfiguration<"doughnut"> {
    const COLORS = [
      "#3B82F6",
      "#8b5cf6",
      "#f59e0b",
      "#10b981",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
    ];
    return new ChartConfigBuilder("doughnut")
      .withLabels(labels)
      .withDataset({
        data,
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "#1a1a1a",
        borderWidth: 2,
        hoverOffset: 6,
      } as ChartDataset<"doughnut">)
      .build();
  }
}
