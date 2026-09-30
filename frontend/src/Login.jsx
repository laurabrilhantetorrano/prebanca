import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./assets/logo.jpg"; 
import { useAuth } from "./AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erroMensagem, setErroMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const lidarComLogin = async (e) => {
    e.preventDefault();
    setErroMensagem("");
    setCarregando(true);

    try {
      await login(username, senha);
      navigate("/");
    } catch (error) {
      setErroMensagem(error.message || "Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Botão flutuante para voltar para a Home */}
      <Link to="/" className="btn-voltar-home">
        ← Voltar para o Início
      </Link>

      <section className="login-section">
        <div className="boas-vindas">
          <img src={logo} alt="Logo" />
          <h2>
            Bem-vindo de volta! Por favor, insira seus dados para acessar sua conta.
          </h2>
        </div>

        <form onSubmit={lidarComLogin} className="grupo-input">
          <h1>Login</h1>
          
          <label htmlFor="username">Usuário ou Email:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (erroMensagem) setErroMensagem("");
            }}
            required 
          />

          <label htmlFor="password">Senha:</label>
          <input 
            type="password" 
            id="senha" 
            name="senha" 
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (erroMensagem) setErroMensagem("");
            }}
            required 
          />

          {erroMensagem && <span className="erro-mensagem">{erroMensagem}</span>}

          <button type="submit" className="btn-enviar-login" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          
          <p>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </section>
    </div>
  );
}