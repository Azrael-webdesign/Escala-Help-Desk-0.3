# 🗓️ Escala HelpDesk

Sistema web inteligente para **gestão de escalas de trabalho**, voltado a equipes de suporte técnico (HelpDesk), com foco em controle, produtividade e clareza visual.

---

## 🚀 Demonstração

[🔗 Acesse aqui o sistema em produção (se aplicável)](https://seu-link.vercel.app)

---

## 📦 Tecnologias Utilizadas

- ⚛️ **React** + **Vite**
- 💅 **Tailwind CSS** + **shadcn/ui**
- ⌨️ **TypeScript**
- 🧠 **Context API** para gerenciamento de escalas
- 📆 **Calendário dinâmico** com lógica por colaborador
- 🧪 Pronto para testes automatizados

---

## 🧩 Funcionalidades

- ✅ Visualização mensal da escala por colaborador
- ✅ Aplicação de **turnos individuais ou em massa**
- ✅ Edição responsiva, fluida e intuitiva
- ✅ Interface amigável com **legendas dinâmicas**
- ✅ Respeito a regras de jornada de trabalho (incluindo DSR e domingos)
- ✅ Integração futura com APIs externas (auth, banco, exportação)

---

## 📁 Estrutura de Pastas

src/
├── assets/ # Ícones e imagens
├── components/ # Componentes reutilizáveis
├── contexts/ # Gerenciadores globais (ScheduleContext, etc)
├── pages/ # Telas principais
├── services/ # Dados mockados / APIs
├── types/ # Tipagens TypeScript
├── hooks/ # Custom hooks (ex: use-mobile)

---

## 🧪 Como Rodar o Projeto Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Escala-Help-Desk-0.3.git
cd Escala-Help-Desk-0.3

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

---

📌 Roadmap
 Edição múltipla de turnos

 Modal visual com turnos detalhados

 Legenda integrada

 Exportação para PDF/Excel

 Autenticação e perfis

 Notificações inteligentes (DSR, ausência, sobrecarga)

📤 Deploy
Você pode publicar facilmente via:

Vercel

Netlify

Basta conectar o repositório e ele será automaticamente deployado via npm run build.

📄 Licença
Este projeto está sob a licença MIT.

👨‍💻 Autor
Desenvolvido por Christian Mendes
🔗 LinkedIn
📬 Christian.mendes@luizalabs.com
