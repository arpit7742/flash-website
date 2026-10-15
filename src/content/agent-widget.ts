/**
 * The floating Flash Agent widget (components/agent-widget.tsx), bottom-right
 * on every page but Book a demo, a slim bar along the bottom on phones.
 *
 * `AGENT_WIDGET_ENABLED` is the one switch: set it to false and the widget,
 * and the room the footer keeps for it, are gone from every page.
 */
export const AGENT_WIDGET_ENABLED = true;

/** Where the question bar goes. */
export const AGENT_HREF = '/products/flash-agent/';

/**
 * Typed into the question bar in this order, then round again: the site's
 * agent demos, each cut to what a crew would actually type.
 */
export const agentWidgetQuestions = [
  'Are gusts low enough to run the crane?',
  "Which lots are in tonight's hail swath?",
  'Did 1-inch hail hit our Plano homes?',
  "Can we play Friday's game?",
  'How much water should we put on the greens tonight?',
  'When will we get the first frost?',
] as const;
