export interface CasinoGame {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    provider: string;
    popularity?: number;
    isNew?: boolean;
    demoUrl?: string;
    gameUrl?: string;
}