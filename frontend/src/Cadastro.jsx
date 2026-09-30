import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import logo from "./assets/logo.jpg"; 
import { useAuth } from "./AuthContext";

export default function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroMensagem, setErroMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const lidarComCadastro = async (e) => {
    e.preventDefault();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.includes("@") || !emailValido.test(email)) {
      setErroMensagem("Por favor, insira um e-mail válido (ex: nome@email.com).");
      return;
    }

    if (senha.length < 6) {
      setErroMensagem("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setErroMensagem("");
    setCarregando(true);

    try {
      await register(username, email, senha);
      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      setErroMensagem(error.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page-container">
      <Link to="/" className="btn-voltar-home-cad">
        ← Voltar para o Início
      </Link>

      <section className="cadastro-section">
        <div className="boas-vindas-cad">
          <img src={logo} alt="Logo" />
          <h2>Bem-vindo! Por favor, insira seus dados para criar sua conta.</h2>
        </div>
      
        <form onSubmit={lidarComCadastro} className="grupo-input-cad">
          <h1>Cadastre-se</h1>
          
          <label htmlFor="username">Usuário:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />

          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erroMensagem) setErroMensagem(""); 
            }}
            required 
          />
          
          <label htmlFor="senha">Senha:</label>
          <input 
            type="password" 
            id="senha" 
            name="senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />

          {/* Se houver erro, renderiza a mensagem na tela */}
          {erroMensagem && <span className="erro-mensagem">{erroMensagem}</span>}

          <button type="submit" className="btn-enviar-cad" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
          
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}