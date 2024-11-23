import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Payment = () => {
    const { bookId } = useParams(); 
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const navigate = useNavigate(); 

    const handlePayment = async (e) => {
        e.preventDefault(); 
        try {
           
            await axios.post(`http://localhost:5000/api/payment/${bookId}`, {
                name,
                cardNumber,
                expiryDate,
                cvv
            });
            alert('Paiement réussi !'); 
            navigate('/'); 
        } catch (error) {
            console.error('Erreur lors du paiement:', error);
            alert('Échec du paiement. Veuillez réessayer.');
        }
    };

    return (
        <div className="container mt-5">
            <Card>
                <CardBody>
                    <CardTitle tag="h5">Informations de Paiement</CardTitle>
                    <Form onSubmit={handlePayment}>
                        <FormGroup>
                            <Label for="name">Nom</Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="cardNumber">Numéro de Carte</Label>
                            <Input
                                type="text"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="expiryDate">Date d'Expiration</Label>
                            <Input
                                type="text"
                                id="expiryDate"
                                placeholder="MM/AA"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="cvv">CVV</Label>
                            <Input
                                type="text"
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <Button color="primary" type="submit">Payer</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default Payment;
