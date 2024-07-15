import React, { useState } from 'react';
import axios from 'axios';
import { Input } from 'antd';

const AddressForm = ({ initialAddress,onAddressChange }) => {
    const [address, setAddress] = useState(initialAddress);
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        setAddress(input);

        if (input.length > 2) {
            try {
                const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
                    params: {
                        text: input,
                        apiKey: 'b67ef9211d5944d694778f5f2d8d8120',
                        format: 'json'
                    }
                });
                setSuggestions(response.data.results);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion.formatted);
        onAddressChange(suggestion.formatted, suggestion.lat, suggestion.lon);
        setSuggestions([]);
    };

    return (
        <div>
            <Input
                type="text"
                value={address}
                onChange={handleInputChange}
                style={{ width: '100%', marginTop: '10px' }}
            />
            <div style={{ position: 'relative' }}>
                {suggestions.length > 0 && (
                    <ul
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            zIndex: '1000',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            listStyleType: 'none',
                            padding: '0',
                            margin: '0',
                        }}>
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ padding: '8px', cursor: 'pointer' }}>
                                {suggestion.formatted}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddressForm;
