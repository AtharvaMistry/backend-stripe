import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { loadStripe } from "@stripe/stripe-js";

function StripePayment() {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const fetchPublishableKey = async () => {
      // Fetch the publishable key from your server
      const response = await fetch("/api/stripe-publishable-key"); // Replace "/api/stripe-publishable-key" with the endpoint that returns the publishable key
      const data = await response.json();
      const publishableKey = data.publishableKey;

      // Load Stripe.js with the publishable key
      const stripe = await loadStripe(publishableKey);
      setStripe(stripe);
    };

    fetchPublishableKey();
  }, []);

  const product = {
    name: "Go fullstack with kurm info tech",
    price: 1000,
    productOwner: "jaimeen makwana",
    description:
      "This beginner-friendly full stack web development course is offered online in blended learning mode, and also in an on-demand self-paced format.",
    quantity: 1,
  };

  const makePayment = async () => {
    const body = { product };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      mode: "cors",
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <>
      <Card style={{ width: "20rem" }}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Button variant="primary" onClick={makePayment}>
            Buy Now for {product.price}
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default StripePayment;
