// HomeProps.ts
import { Market } from '../Marketplace/Marketplace';

export interface HomeProps {
    addMarket: (newMarket: Market) => void;
    markets: Market[];
}
