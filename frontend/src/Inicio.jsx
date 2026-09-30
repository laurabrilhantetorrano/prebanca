import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { CircleUserRound, ShoppingCart, Search, LogOut, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";
import React, { useState, useEffect } from "react";
import "./Inicio.css";
import { useCarrinho } from "./CarrinhoContext";
import { useAuth } from "./AuthContext";
import { clothesAPI } from "./services/api";
import { resolverImagemProduto } from "./utils/imageHelper";
import { listaProdutosInicial } from "./utils/mockProdutos";

import slider1 from "./assets/slider1.png";
import slider2 from "./assets/slider2.png";
import logo from "./assets/logo.jpg";

export default function Inicio() {
  const { carrinho } = useCarrinho();
  const { user, logout, isAuthenticated } = useAuth();
  const [produtos, setProdutos] = useState(listaProdutosInicial);
  const [termoPesquisa, setTermoPesquisa] = useState("");

  useEffect(() => {
    const carregarRoupasDoBackend = async () => {
      try {
        const roupasDaApi = await clothesAPI.getAll({ catalog: 'true' });
        if (Array.isArray(roupasDaApi) && roupasDaApi.length > 0) {
          setProdutos(roupasDaApi);
        }
      } catch (err) {
        console.warn("Utilizando catálogo local como fallback:", err.message);
      }
    };

    carregarRoupasDoBackend();
  }, []);

  const totalItens = carrinho.reduce(
    (acc, item) => acc + item.quantidade,
    0
  );

  const produtosFiltrados = produtos.filter((item) => {
    const nome = (item.nome || item.name || "").toLowerCase();
    return nome.includes(termoPesquisa.toLowerCase());
  });

  return (
    <div className="app">
      {/* BARRA DE NAVEGAÇÃO */}
      <div className="navbar">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />
        </Link>

        <div className="menu">
          <Link
            to="/sobre-nos"
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <span>Sobre nós</span>
          </Link>

          <Link
            to="/contato"
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <span>Contato</span>
          </Link>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
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

        {/* PESQUISA */}
        <div className="container-pesquisa">
          <input
            type="text"
            placeholder="Buscar produto..."
            className="input-pesquisa"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />

          <Search
            size={18}
            className="icone-lupa"
          />
        </div>

        {/* ÍCONES */}
        <div className="icons" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.88em", fontWeight: "600", color: "#374151" }}>
                Olá, {user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                title="Sair da conta"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{ color: "inherit" }}
              title="Fazer Login"
            >
              <CircleUserRound size={30} />
            </Link>
          )}

          <Link
            to="/carrinho"
            style={{
              color: "inherit",
              position: "relative"
            }}
          >
            <ShoppingCart size={30} />

            {totalItens > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-8px",
                  background: "#ff3b30",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "11px",
                  fontWeight: "bold"
                }}
              >
                {totalItens}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* BANNER */}
      <div className="banner">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop={true}
        >
          <SwiperSlide>
            <img
              src={slider1}
              alt="slider1"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src={slider2}
              alt="slider2"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* BARRA DE FRETE */}
      <div className="info-barra">
        <div>💳 Parcele em até 12x</div>
        <div>🚛 Frete grátis acima de R$199</div>
        <div>🛡️ Site seguro</div>
        <div>🎯 Produto de qualidade</div>
      </div>

      {/* PRIMEIRA FILEIRA */}
      <h2 className="titulo-fileira">
        Coleção Nana & Mimi 
      </h2>

      <div className="produtos">
        {produtosFiltrados.slice(0, 4).map((item, index) => {
          const itemKey = item.id || item._id || index;
          return (
            <div
              key={`item-row1-${itemKey}`}
              className="card-wrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Link
                to={`/produto/${item.id || item._id}`}
                className="card-link"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%"
                }}
              >
                <div className="card">
                  <img
                    src={resolverImagemProduto(item)}
                    alt={item.nome || item.name}
                  />

                  <p className="nome">
                    {item.nome || item.name}
                  </p>

                  <p className="preco-antigo">
                    <del>
                      {item.precoAntigo || item.oldPrice || ""}
                    </del>
                  </p>

                  <p className="preco">
                    {item.preco || item.price}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* SEGUNDA FILEIRA */}
      <h2 className="titulo-fileira">
        Conforto & Estilo
      </h2>

      <div className="produtos">
        {produtosFiltrados.slice(4).map((item, index) => {
          const itemKey = item.id || item._id || index;
          return (
            <div
              key={`item-row2-${itemKey}`}
              className="card-wrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Link
                to={`/produto/${item.id || item._id}`}
                className="card-link"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%"
                }}
              >
                <div className="card">
                  <img
                    src={resolverImagemProduto(item)}
                    alt={item.nome || item.name}
                  />

                  <p className="nome">
                    {item.nome || item.name}
                  </p>

                  <p className="preco-antigo">
                    <del>
                      {item.precoAntigo || item.oldPrice || ""}
                    </del>
                  </p>

                  <p className="preco">
                    {item.preco || item.price}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}