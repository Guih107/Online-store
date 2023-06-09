import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { handleButtonAddCart } from '../services/ShoppingCartButtons';
import Loading from '../components/Loading';
import './Product.css';
import Star from '../components/Star';
import Error from '../components/Error';
import Shipping from '../components/Shipping';

const starGrey = { color: 'lightgrey' };
const starYellow = { color: 'yellow' };
const starMax = ['1', '2', '3', '4', '5'];

class Product extends Component {
  state = {
    product: {},
    isLoading: true,
    email: '',
    rating: 0,
    text: '',
    starColored: [starGrey, starGrey, starGrey, starGrey, starGrey],
    starClick: false,
    markedStars: false,
    assessments: [],
    validadeForm: false,
    isError: false,
  };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const product = await getProductById(id);
    const assessments = JSON.parse(localStorage.getItem(id)) || [];
    this.setState({
      product,
    }, () => {
      this.setState({
        isLoading: false,
        assessments,
      });
    });
  }

  verifyForm = () => {
    this.setState({
    });
    const { email, rating } = this.state;
    const validadeForm = email.length > 0 && rating > 0 && email.includes('@');
    console.log(validadeForm, email, rating);
    if (validadeForm) { this.setState({ validadeForm: true }); }
    if (!validadeForm) { this.setState({ validadeForm: false }); }
  };

  onInputChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    }, this.verifyForm);
  };

  setLocalStorage = () => {
    const { match: { params: { id } } } = this.props;
    const { email, rating, text, assessments, validadeForm } = this.state;
    const avaliate = { email, rating, text };
    if (validadeForm) {
      localStorage.setItem(id, JSON.stringify([...assessments, avaliate]));
      this.setState((prevState) => ({
        assessments: [...prevState.assessments, avaliate],
        email: '',
        rating: 0,
        text: '',
        isError: false,
        validadeForm: false,
      }));
    } else {
      this.setState({
        isError: true,
      });
    }
  };

  colorStar = (index) => {
    this.setState((prevState) => ({
      starColored: prevState.starColored.map((_, indexStars) => (indexStars <= index
        ? starYellow
        : starGrey)),
    }));
  };

  uncolorStar = () => {
    const { rating } = this.state;
    this.setState((prevState) => ({
      starColored: prevState.starColored.map((_, indexStars) => (
        (indexStars + 1) <= rating ? starYellow : starGrey
      )),
    }));
  };

  setHatingStars = (index) => {
    this.setState({
      rating: index + 1,
    }, () => {
      this.verifyForm();
      this.setState(
        (prevState) => ({
          starColored: prevState.starColored.map((_, indexStars) => (
            (indexStars + 1) <= prevState.rating ? starYellow : starGrey
          )),
        }),
      );
    });
  };

  render() {
    const { product, isLoading, email, text, starColored, rating,
      assessments, isError } = this.state;
    const { pictures, price, attributes, shipping } = product;
    const priceBr = String(price).replace('.', ',');
    document.title = `G23_OnlineStore | ${product.title}`;

    return (
      <div>
        { isLoading ? <Loading /> : (
          <div>
            <div>
              <h2 data-testid="product-detail-name">{ product.title }</h2>
              <h2 data-testid="product-detail-price">{ `R$: ${priceBr} (${price})` }</h2>
              <div>
                { pictures.map((pic) => (
                  <img
                    key={ pic.id }
                    data-testid="product-detail-image"
                    src={ pic.url }
                    alt={ product.title }
                  />
                )) }
              </div>
              { shipping.free_shipping ? <Shipping /> : null }
              <div>
                <ul>
                  { attributes.map((atributte) => (
                    <li key={ atributte.id }>
                      { `${atributte.name}: ${atributte.value_name}` }
                    </li>
                  )) }
                </ul>
              </div>
            </div>
            <Link to="/shoppingCart">
              <button
                type="submit"
                data-testid="shopping-cart-button"
              >
                Meu carrinho
              </button>
            </Link>
            <button
              data-testid="product-detail-add-to-cart"
              type="button"
              onClick={ () => handleButtonAddCart(this.state) }
            >
              Adicionar ao carrinho
            </button>
          </div>
        ) }
        <section>
          <h3>Avaliações:</h3>
          <form>
            <input
              type="text"
              name="email"
              placeholder="email"
              data-testid="product-detail-email"
              onChange={ this.onInputChange }
              value={ email }
            />

            <div>
              { starMax.map((star, index) => (
                <Star
                  key={ star }
                  id={ star }
                  style={ starColored[index] }
                  onMouseOver={ () => this.colorStar(index) }
                  onMouseOut={ this.uncolorStar }
                  onClick={ () => this.setHatingStars(index) }
                />
              )) }
              <p>
                { rating }
              </p>
            </div>

            <input
              type="textarea"
              name="text"
              placeholder="Mensagem (opcional)"
              data-testid="product-detail-evaluation"
              onChange={ this.onInputChange }
              value={ text }
            />

            { isError ? <Error /> : null }

            <div>
              <button
                type="button"
                data-testid="submit-review-btn"
                onClick={ this.setLocalStorage }
              >
                Avaliar produto!
              </button>
            </div>
          </form>

        </section>
        <section>
          { assessments.map((avaliate) => (
            <div key={ avaliate.email }>
              <ul>
                <li data-testid="review-card-email">{ avaliate.email }</li>
                <li data-testid="review-card-rating">{ avaliate.rating }</li>
                <li data-testid="review-card-evaluation">{ avaliate.text }</li>
              </ul>
            </div>
          )) }
        </section>
      </div>
    );
  }
}

Product.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;

export default Product;
