import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import Image1 from "./assets/Image1.jpeg";
import Image2 from "./assets/Image2.jpeg";
import Image3 from "./assets/Image3.jpeg";

const MainPage = () => {
  const fullHeightStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh",
  };

  function handleClick() {
    window.open("https://github.com/ByungHeonLEE/NoFakeChain", "_blank");
  }

  return (
    <div style={fullHeightStyle}>
      <Container fluid>
        {/* Main Content */}
        <Container className="text-center my-5">
          <h1>Welcome to NoFakeChain</h1>
          <p>
            Ensuring the authenticity of images using the power of blockchain.
          </p>
          <Button variant="primary" size="lg" onClick={handleClick}>
            Learn More
          </Button>
        </Container>

        {/* Cards */}
        <Row className="m-4">
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src={Image1} />
              <Card.Body>
                <Card.Text>
                  You can check any type of the contents including video, image
                  and also text
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src={Image2} />
              <Card.Body>
                <Card.Text>
                  Leveraging blockchain's features to check the content's
                  authenticity
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src={Image3} />
              <Card.Body>
                <Card.Text>Blockchain App</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
