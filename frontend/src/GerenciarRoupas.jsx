import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, Shirt, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { clothesAPI } from "./services/api";
import { resolverImagemProduto } from "./utils/imageHelper";
import "./GerenciarRoupas.css";

const FORM_INICIAL = {
  name: "",
  category: "Camiseta",
  color: "Preto",
  size: "M",
  price: "R$ 49,90",
  image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60",
  description: ""
};

export default function GerenciarRoupas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [roupas, setRoupas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarRoupasDoUsuario = async () => {
    try {
      setCarregando(true);
      const data = await clothesAPI.getAll();
      if (Array.isArray(data)) {
        setRoupas(data);
      }
    } catch (err) {
      console.error("Erro ao carregar roupas:", err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAuthenticated) {
      carregarRoupasDoUsuario();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const abrirModalCriacao = () => {
    setEditandoId(null);
    setFormData(FORM_INICIAL);
    setErroForm("");
    setModalAberto(true);
  };

  const abrirModalEdicao = (roupa) => {
    setEditandoId(roupa.id || roupa._id);
    setFormData({
      name: roupa.name || roupa.nome || "",
      category: roupa.category || roupa.categoria || "Geral",
      color: roupa.color || roupa.cor || "Padrão",
      size: roupa.size || roupa.tamanho || "M",
      price: roupa.price || roupa.preco || "R$ 0,00",
      image: roupa.image || roupa.img || "",
      description: roupa.description || roupa.desc || ""
    });
    setErroForm("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditandoId(null);
    setErroForm("");
  };

  const lidarComSalvar = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      setErroForm("Por favor, preencha o nome e a URL da imagem.");
      return;
    }

    setSalvando(true);
    setErroForm("");

    try {
      if (editandoId) {
        await clothesAPI.update(editandoId, formData);
      } else {
        await clothesAPI.create(formData);
      }
      fecharModal();
      await carregarRoupasDoUsuario();
    } catch (err) {
      setErroForm(err.message || "Erro ao salvar roupa. Verifique os dados.");
    } finally {
      setSalvando(false);
    }
  };

  const lidarComExcluir = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      try {
        await clothesAPI.delete(id);
        setRoupas((prev) => prev.filter((r) => (r.id || r._id) !== id));
      } catch (err) {
        alert("Erro ao excluir roupa: " + err.message);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="gerenciar-roupas-container" style={{ textAlign: "center", padding: "60px" }}>
        <p>Carregando dados da sua conta...</p>
      </div>
    );
  }

  return (
    <div className="gerenciar-roupas-container">
      {/* Header de Gestão */}
      <div className="gerenciar-header">
        <div className="gerenciar-titulo">
          <h1>Minhas Roupas Cadastradas</h1>
          <p>
            Gerencie o catálogo de roupas da sua conta ({user?.name}) com persistência direta no MongoDB.
          </p>
        </div>

        <div className="gerenciar-acoes">
          <Link to="/" className="btn-voltar-loja">
            <ArrowLeft size={18} />
            Voltar para a Loja
          </Link>

          <button onClick={abrirModalCriacao} className="btn-nova-roupa">
            <Plus size={18} />
            Cadastrar Roupa
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {carregando ? (
        <p style={{ textAlign: "center", padding: "40px" }}>Carregando suas roupas...</p>
      ) : roupas.length === 0 ? (
        <div className="roupas-vazio">
          <Shirt size={48} color="#9ca3af" />
          <h3>Nenhuma roupa cadastrada por você ainda</h3>
          <p>Cadastre suas próprias peças para visualizá-las e gerenciá-las no sistema.</p>
          <button onClick={abrirModalCriacao} className="btn-nova-roupa">
            <Plus size={18} /> Cadastrar Minha Primeira Roupa
          </button>
        </div>
      ) : (
        <div className="roupas-grid">
          {roupas.map((roupa) => {
            const id = roupa.id || roupa._id;
            const nome = roupa.nome || roupa.name;
            const preco = roupa.preco || roupa.price;
            const categoria = roupa.categoria || roupa.category || "Geral";
            const cor = roupa.cor || roupa.color || "Padrão";
            const tamanho = roupa.tamanho || roupa.size || "M";
            const desc = roupa.desc || roupa.description || "";
            const img = resolverImagemProduto(roupa);

            return (
              <div key={id} className="roupa-card">
                <div className="roupa-img-container">
                  <img src={img} alt={nome} />
                </div>

                <div className="roupa-info">
                  <div className="roupa-tags">
                    <span className="tag">{categoria}</span>
                    <span className="tag">Tam: {tamanho}</span>
                    <span className="tag">{cor}</span>
                  </div>

                  <h3 className="roupa-nome">{nome}</h3>
                  <p className="roupa-preco">{preco}</p>
                  {desc && <p className="roupa-desc">{desc}</p>}

                  <div className="roupa-card-acoes">
                    <button
                      onClick={() => abrirModalEdicao(roupa)}
                      className="btn-card-editar"
                    >
                      <Edit2 size={15} /> Editar
                    </button>
                    <button
                      onClick={() => lidarComExcluir(id, nome)}
                      className="btn-card-excluir"
                    >
                      <Trash2 size={15} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editandoId ? "Editar Roupa" : "Cadastrar Nova Roupa"}</h2>
              <button onClick={fecharModal} className="btn-fechar-modal">
                &times;
              </button>
            </div>

            {erroForm && (
              <div style={{ color: "#dc2626", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={18} />
                <span>{erroForm}</span>
              </div>
            )}

            <form onSubmit={lidarComSalvar}>
              <div className="form-grid">
                <div className="form-campo form-campo-full">
                  <label htmlFor="name">Nome da Roupa *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Vestido Floral Infantil"
                    required
                  />
                </div>

                <div className="form-campo">
                  <label htmlFor="category">Categoria</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Camiseta">Camiseta</option>
                    <option value="Calça">Calça</option>
                    <option value="Vestido">Vestido</option>
                    <option value="Conjunto">Conjunto</option>
                    <option value="Pijama">Pijama</option>
                    <option value="Body">Body</option>
                    <option value="Moletom">Moletom</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="form-campo">
                  <label htmlFor="color">Cor</label>
                  <input
                    type="text"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Ex: Azul, Rosa, Branco"
                  />
                </div>

                <div className="form-campo">
                  <label htmlFor="size">Tamanho</label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="Infantil 4-6">Infantil 4-6</option>
                    <option value="Infantil 6-8">Infantil 6-8</option>
                    <option value="Infantil 8-10">Infantil 8-10</option>
                    <option value="Infantil 10-12">Infantil 10-12</option>
                  </select>
                </div>

                <div className="form-campo">
                  <label htmlFor="price">Preço</label>
                  <input
                    type="text"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: R$ 79,90"
                  />
                </div>

                <div className="form-campo form-campo-full">
                  <label htmlFor="image">URL da Imagem *</label>
                  <input
                    type="text"
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Ex: https://... ou /src/assets/produto1.png"
                    required
                  />
                </div>

                <div className="form-campo form-campo-full">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva detalhes, tecido e caimento da peça..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={fecharModal} className="btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="btn-salvar">
                  {salvando ? "Salvando..." : editandoId ? "Atualizar Roupa" : "Cadastrar Roupa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
