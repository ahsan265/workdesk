export interface AgentSettings {
    display_name: string | null;
    language_ids: number[];
    first_name?: string | null;
    last_name?: string | null;
    admin: boolean;
}