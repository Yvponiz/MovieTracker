export function addMouseMoveEffectToCards(cardsId: string) {
  if (typeof document !== 'undefined') {
    const cards = document.getElementById(cardsId);

    if (cards) {
      // For hover effect on mouse move
      cards.onmousemove = (e: MouseEvent) => {
        const cardList = document.getElementsByClassName("card") as HTMLCollectionOf<HTMLElement>;
        for (const card of cardList) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }
      };
    }
  }
}
