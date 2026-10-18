export declare class Playcard {
  constructor(options?: {
    name?: string;
    author?: string;
    color?: string;
    theme?: "sore" | "listune";
    brightness?: number;
    thumbnail?: string;
    progress?: number | string;
    startTime?: string;
    endTime?: string;
    requester?: string;
  });

  public setName(name: string): this;
  public setAuthor(author: string): this;
  public setColor(color: string): this;
  public setTheme(theme?: "sore" | "listune" | string): this;
  public setBrightness(brightness: number): this;
  public setThumbnail(thumbnail: string): this;
  public setProgress(progress: number | string): this;
  public setStartTime(starttime: string): this;
  public setEndTime(endtime: string): this;
  public setRequester(requester: string): this;

  public build(): Promise<Buffer>;
}

export declare const playcard: typeof Playcard;
export default Playcard;