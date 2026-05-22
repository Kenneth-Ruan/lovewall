const WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckers', 'fucks',
  'shit', 'shitting', 'shitty', 'shits',
  'ass', 'asshole', 'assholes', 'asses',
  'bitch', 'bitches', 'bitching',
  'bastard', 'bastards',
  'cunt', 'cunts',
  'dick', 'dicks',
  'cock', 'cocks',
  'pussy', 'pussies',
  'whore', 'whores',
  'slut', 'sluts',
  'nigger', 'niggers', 'nigga',
  'faggot', 'faggots', 'fag', 'fags',
  'retard', 'retarded', 'retards',
];

export function censor(text: string): string {
  let result = text;
  for (const word of WORDS) {
    const regex = new RegExp(`(?<![a-zA-Z])${word}(?![a-zA-Z])`, 'gi');
    result = result.replace(regex, (m) => m[0] + '*'.repeat(m.length - 1));
  }
  return result;
}
