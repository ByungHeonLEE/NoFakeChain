import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

const MainPage = () => {
  const fullHeightStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh",
  };

  return (
    <div style={fullHeightStyle}>
      <Container fluid>
        {/* Main Content */}
        <Container className="text-center my-5">
          <h1>Welcome to NoFakeChain</h1>
          <p>
            Ensuring the authenticity of images using the power of blockchain.
          </p>
          <Button variant="primary" size="lg">
            Learn More
          </Button>
        </Container>

        {/* Cards */}
        <Row className="m-4">
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="path_to_image1.jpg" />
              <Card.Body>
                <Card.Title>Feature 1</Card.Title>
                <Card.Text>Description for feature 1.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="path_to_image2.jpg" />
              <Card.Body>
                <Card.Title>Feature 2</Card.Title>
                <Card.Text>Description for feature 2.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="path_to_image3.jpg" />
              <Card.Body>
                <Card.Title>Feature 3</Card.Title>
                <Card.Text>Description for feature 3.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
