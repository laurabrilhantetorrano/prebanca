import React from 'react';
import { Link } from 'react-router-dom';
import { CircleUserRound, ShoppingCart, Search, ArrowLeft, MapPin, Phone, Mail, Clock, Instagram, Shirt, LogOut } from 'lucide-react';
import logo from "./assets/logo.jpg";
import './Contato.css';
import { useAuth } from './AuthContext';

export default function Contato() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="app">
      {/* Barra de Navegação */}
      <div className="navbar">
        <Link to="/">
          <img src={logo} alt="Logo Nana&Mimi" className="logo" />
        </Link>

        <div className="menu">
          <Link to="/sobre-nos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Sobre nós</span>
          </Link>
          <Link to="/contato" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Contato</span>
          </Link>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Roupas</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/minhas-roupas"
              style={{
                textDecoration: "none",
                color: "#1d4ed8",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Shirt size={16} />
              <span>Minhas Roupas</span>
            </Link>
          )}
        </div>

        <div className="container-pesquisa">
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            className="input-pesquisa"
          />
          <Search size={18} className="icone-lupa" />
        </div>

        <div className="icons" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88em', fontWeight: '600', color: '#374151' }}>
                Olá, {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                title="Sair da conta"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ color: 'inherit' }} title="Fazer Login">
              <CircleUserRound size={30} />
            </Link>
          )}
          <Link to="/carrinho" style={{ color: 'inherit' }}>
            <ShoppingCart size={30} />
          </Link>
        </div>
      </div>

      {/* Conteúdo de Contato Centralizado */}
      <main className="contato-container">

        <div className="contato-conteudo-central">
          <h1>Contato</h1>

          <div className="contato-texto">
            <p>
              Tem dúvidas sobre tamanhos, trocas, prazos de entrega ou quer saber mais sobre nossa coleção? Estamos sempre prontas para ajudar você com todo o carinho que a sua família merece!
            </p>
            <p>
              Adoramos conversar com quem compartilha do nosso amor pela moda infantil. Entre em contato conosco através dos canais abaixo:
            </p>
          </div>

          <div className="info-cards-central">
            <div className="card-item-central">
              <Phone size={22} />
              <div>
                <strong>WhatsApp</strong>
                <p>(19) 99572-9704</p>
              </div>
            </div>

            <div className="card-item-central">
              <Mail size={22} />
              <div>
                <strong>E-mail</strong>
                <p>nanaemimimodainfantil@gmail.com</p>
              </div>
            </div>

            <div className="card-item-central">
              <Instagram size={22} />
              <div>
                <strong>Instagram</strong>
                <p>@nanaemimimodainfantil</p>
              </div>
            </div>

            <div className="card-item-central">
              <Clock size={22} />
              <div>
                <strong>Horário de Atendimento</strong>
                <p>Segunda a Sábado, das 9h às 17h</p> 
              </div>
            </div>

            <div className="card-item-central">
              <MapPin size={22} />
              <div>
                <strong>Localização</strong>
                <p>Rua José Ramos Catarino 396 Pq Tropical - Campinas/SP</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}