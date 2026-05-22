export type CardColor = 'rose' | 'lavender' | 'sky' | 'mint' | 'peach' | 'cream';

export interface Message {
  id: string;
  content: string;
  color: CardColor;
  author_id: string;
  author_name: string;
  is_anonymous: boolean;
  created_at: string;
  reaction_counts?: ReactionCount[];
}

export interface ReactionCount {
  emoji: string;
  count: number;
}
