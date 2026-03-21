import { PresentationDeck } from "./components/PresentationDeck";
import { slides } from "./content/slides";

export default function App() {
  return <PresentationDeck slides={slides} deckTitle="SICA RTSE Presentation" />;
}
