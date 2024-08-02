import React, { useState } from 'react';
import './Marketplace.css';

export interface Market {
    id: number;
    picture: string;
    title: string;
    location: string;
    openHours: string;
    category: string;
}

const Marketplace: React.FC = () => {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [newMarket, setNewMarket] = useState<Market>({
        id: 0,
        picture: '',
        title: '',
        location: '',
        openHours: '',
        category: '',
    });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const addMarket = () => {
        setMarkets((prevMarkets) => [
            ...prevMarkets,
            { ...newMarket, id: prevMarkets.length + 1 },
        ]);
        setNewMarket({
            id: 0,
            picture: '',
            title: '',
            location: '',
            openHours: '',
            category: '',
        });
    };

    const filteredMarkets = selectedCategory
        ? markets.filter((m) => m.category === selectedCategory)
        : markets;

    return (
        <div>
            <h1>Marketplace</h1>
            <button onClick={addMarket}>Add Market</button>
            <label>
                Filter by Category:
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                    <option value="">All</option>
                    {/* Add your categories dynamically based on your data */}
                    <option value="Market">Market</option>
                    <option value="category2">Category 2</option>
                </select>
            </label>
            {filteredMarkets.map((market) => (
                <div key={market.id}>
                    <img src={market.picture} alt={market.title} />
                    <h2>{market.title}</h2>
                    <p>Location: {market.location}</p>
                    <p>Open Hours: {market.openHours}</p>
                    <p>Category: {market.category}</p>
                </div>
            ))}
            <div>
                {/* Form to add a new market */}
                <h2>Add New Market</h2>
                <label>
                    Picture URL:
                    <input
                        type="text"
                        value={newMarket.picture}
                        onChange={(e) =>
                            setNewMarket({ ...newMarket, picture: e.target.value })
                        }
                    />
                </label>
                <label>
                    Title:
                    <input
                        type="text"
                        value={newMarket.title}
                        onChange={(e) =>
                            setNewMarket({ ...newMarket, title: e.target.value })
                        }
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        value={newMarket.location}
                        onChange={(e) =>
                            setNewMarket({ ...newMarket, location: e.target.value })
                        }
                    />
                </label>
                <label>
                    Open Hours:
                    <input
                        type="text"
                        value={newMarket.openHours}
                        onChange={(e) =>
                            setNewMarket({ ...newMarket, openHours: e.target.value })
                        }
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        value={newMarket.category}
                        onChange={(e) =>
                            setNewMarket({ ...newMarket, category: e.target.value })
                        }
                    />
                </label>
            </div>
        </div>
    );
};

export default Marketplace;
