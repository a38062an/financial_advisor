export interface ChartData {
  chart_config: {
    type: string;
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
        tension?: number;
      }>;
    };
    options: {
      responsive: boolean;
      plugins?: {
        legend?: {
          display: boolean;
          position: string;
        };
      };
      scales?: {
        x?: {
          title?: {
            display: boolean;
            text: string;
          };
        };
        y?: {
          title?: {
            display: boolean;
            text: string;
          };
          beginAtZero?: boolean;
        };
      };
    };
  };
  data: Record<string, any>;
  chart_type: string;
  title: string;
}

export interface TranscriptMessage {
  text: string;
  timestamp: number;
  speaker?: string;
  confidence?: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface AnalysisResult {
  intent: string;
  confidence: number;
  entities: Record<string, any>;
  requires_visualization: boolean;
  original_text: string;
  visualization_type: string;
}