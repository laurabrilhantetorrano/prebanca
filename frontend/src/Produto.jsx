import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Produto.css";
import { ArrowLeft } from "lucide-react";
import { useCarrinho } from "./CarrinhoContext";
import { clothesAPI } from "./services/api";
import { resolverImagemProduto } from "./utils/imageHelper";
import { listaProdutosInicial } from "./utils/mockProdutos";

export default function Produto() {
  const { adicionarAoCarrinho } = useCarrinho();
  const { id } = useParams();
  const [produto, setProduto] = useState(() => {
    return listaProdutosInicial.find((item) => String(item.id) === String(id)) || null;
  });
  const [carregando, setCarregando] = useState(!produto);

  useEffect(() => {
    let montado = true;

    const carregarProduto = async () => {
      try {
        const dados = await clothesAPI.getById(id);
        if (montado && dados) {
          setProduto(dados);
        }
      } catch (err) {
        console.warn("Buscando produto no acervo local:", err.message);
        const local = listaProdutosInicial.find(
          (item) => String(item.id) === String(id)
        );
        if (montado && local) {
          setProduto(local);
        }
      } finally {
        if (montado) setCarregando(false);
      }
    };

    carregarProduto();

    return () => {
      montado = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <div className="produto-detalhes-container">
        <p style={{ textAlign: "center", padding: "40px" }}>Carregando produto...</p>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="produto-detalhes-container">
        <h2>Produto não encontrado!</h2>
        <Link to="/" style={{ color: "#000", fontWeight: "bold" }}>← Voltar para o início</Link>
      </div>
    );
  }

  const imagemExibida = resolverImagemProduto(produto);
  const nomeExibido = produto.nome || produto.name;
  const precoExibido = produto.preco || produto.price;
  const descExibida = produto.desc || produto.description;

  return (
    <div className="produto-detalhes-container">
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#000",
          marginBottom: "20px",
          fontWeight: "bold"
        }}
      >
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <div className="produto-wrapper">
        <div className="produto-imagem">
          <img
            src={imagemExibida}
            alt={nomeExibido}
          />
        </div>

        <div className="produto-info">
          <h1>{nomeExibido}</h1>

          <p className="produto-preco">
            {precoExibido}
          </p>

          <p className="produto-descricao">
            {descExibida}
          </p>

          <div className="opcoes-compra">
            <label htmlFor="tamanho">
              Tamanho:
            </label>

            <select id="tamanho" defaultValue={produto.tamanho || produto.size || "M"}>
              <option>P</option>
              <option>M</option>
              <option>G</option>
              <option>GG</option>
            </select>
          </div>

          <button
            onClick={() =>
              adicionarAoCarrinho({
                ...produto,
                id: produto.id || produto._id,
                nome: nomeExibido,
                preco: precoExibido,
                img: imagemExibida
              })
            }
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}