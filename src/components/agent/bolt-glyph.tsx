import { FlashAvatar } from '@/components/flash-mark';

/** The agent's avatar, a disc (or a tile with `square`): <FlashAvatar /> at 32px. */
export function AgentAvatar({ square = false }: { square?: boolean }) {
  return <FlashAvatar className={`size-8 ${square ? 'rounded-lg' : 'rounded-full'}`} />;
}
