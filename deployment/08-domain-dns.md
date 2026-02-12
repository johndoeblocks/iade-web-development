# 08 - Domínio e DNS

## 🎯 Objetivos
- Configurar domínio personalizado
- Entender DNS básico
- SSL/HTTPS automático

---

## 🌐 Comprar Domínio

### Registrars Populares
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://cloudflare.com)
- [GoDaddy](https://godaddy.com)

### Escolher Nome
```
padreginos.pt        → Portugal
padreginos.com       → Global
api.padreginos.com   → Subdomínio para API
```

---

## 🔧 DNS Basics

### Tipos de Records

| Tipo | Uso | Exemplo |
|------|-----|---------|
| A | Aponta para IPv4 | 192.168.1.1 |
| AAAA | Aponta para IPv6 | 2001:db8::1 |
| CNAME | Alias para outro domínio | app.railway.app |
| TXT | Texto (verificação) | "verify=abc123" |

---

## 🚂 Railway - Domínio Custom

### 1. Gerar Domínio
1. Service → Settings → Domains
2. "Generate Domain" → Copia URL temporário
3. "Add Custom Domain" → Adiciona o teu domínio

### 2. Configurar DNS
No teu registrar:

```
# Para domínio root (padreginos.com)
Type: CNAME (ou ALIAS se suportado)
Name: @
Value: your-app.up.railway.app

# Para subdomínio (api.padreginos.com)
Type: CNAME
Name: api
Value: your-backend.up.railway.app
```

### 3. Verificar
- Railway verifica automaticamente
- Pode demorar até 48h (normalmente minutos)
- SSL é gerado automaticamente

---

## 🔒 HTTPS/SSL

Railway providencia SSL automático via Let's Encrypt.

### Forçar HTTPS
```javascript
// Middleware para redirecionar HTTP → HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && 
      process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});
```

---

## 📁 Estrutura Multi-Domínio

```
padreginos.com          → Frontend
api.padreginos.com      → Backend
admin.padreginos.com    → Dashboard (futuro)
```

### CORS para Múltiplos Domínios
```javascript
const corsOptions = {
  origin: [
    'https://padreginos.com',
    'https://www.padreginos.com',
    'https://admin.padreginos.com'
  ]
};
```

---

## 🔍 Troubleshooting

### DNS não propaga
```bash
# Verificar propagação
dig padreginos.com
nslookup padreginos.com

# Ou usar
# https://dnschecker.org
```

### SSL não funciona
1. Verifica que DNS está correto
2. Espera alguns minutos
3. No Railway: Settings → Delete Domain → Re-add

---

## ✅ Checklist Final

- [ ] Domínio comprado
- [ ] DNS configurado (CNAME)
- [ ] Railway verifica domínio
- [ ] SSL ativo (https funciona)
- [ ] www redireciona para non-www (ou vice-versa)
- [ ] API em subdomínio separado

---

## 🎉 Parabéns!

A tua pizzaria está online em:
- 🌐 https://padreginos.com
- 🔌 https://api.padreginos.com

---

## 🧪 Exercício

1. (Opcional) Compra um domínio
2. Configura DNS no registrar
3. Adiciona domínio no Railway
4. Verifica HTTPS funciona
5. Atualiza VITE_API_URL

---

## 📚 Recursos
- [Railway Custom Domains](https://docs.railway.app/deploy/exposing-your-app#custom-domains)
- [DNS Explained](https://howdns.works/)
