declare module 'pdf-poppler' {
  export interface ConvertOptions {
    format?: 'jpeg' | 'png';
    out_dir: string;
    out_prefix?: string;
    page?: number;
    resolution?: number;
    scale?: number;
  }

  export function convert(filePath: string, options: ConvertOptions): Promise<void>;
}
