/**
 * BREVO WORKER — Cloudflare Worker para envío automático de newsletter
 *
 * DESPLIEGUE:
 * 1. dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Pega este código y despliega
 * 3. Settings → Variables → añade: BREVO_API_KEY = xkeysib-...
 * 4. Copia la URL del Worker y ponla en index.html (variable BREVO_WORKER_URL)
 */

const NEWSLETTER_HTML = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#050010;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050010;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr>
    <td style="background:linear-gradient(135deg,#0d001f,#1a0035);border-radius:20px 20px 0 0;padding:50px 40px 40px;text-align:center;border:1px solid rgba(212,175,55,0.3);border-bottom:none;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#d4af37;">✦ María Jacaranda ✦</p>
      <h1 style="margin:0 0 10px;font-family:'Georgia',serif;font-size:32px;color:#f0e8ff;line-height:1.2;">Tu Talismán Sagrado<br><span style="color:#d4af37;">te Espera</span></h1>
      <p style="margin:0;font-size:13px;color:#9d8ab5;letter-spacing:2px;">VIDENTE · ASTRÓLOGA · 30 AÑOS DE EXPERIENCIA</p>
      <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:20px auto 0;"></div>
    </td>
  </tr>
  <tr>
    <td style="background:#0d001f;padding:40px;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <p style="margin:0 0 20px;font-size:17px;color:#f0e8ff;line-height:1.8;">Querida {{nombre}},</p>
      <p style="margin:0 0 20px;font-size:15px;color:#c8b8e8;line-height:1.9;">Gracias por confiar en mí. Tu solicitud ha llegado a mis manos y muy pronto recibirás tu <strong style="color:#d4af37;">talismán de bienvenida</strong>, cargado con la energía que el cosmos ha reservado especialmente para ti.</p>
      <p style="margin:0;font-size:15px;color:#c8b8e8;line-height:1.9;">Llevo <strong style="color:#d4af37;">30 años</strong> acompañando a miles de personas a través del Tarot, la Astrología y las Piedras Sagradas. Hoy me alegra que formes parte de esta comunidad.</p>
    </td>
  </tr>
  <tr>
    <td style="background:#0d001f;padding:0 40px;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid rgba(212,175,55,0.2);padding-top:30px;text-align:center;"><span style="font-size:20px;color:#d4af37;">✦ ✦ ✦</span></td></tr></table>
    </td>
  </tr>
  <tr>
    <td style="background:#0d001f;padding:10px 40px 40px;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <h2 style="margin:0 0 25px;font-family:'Georgia',serif;font-size:20px;color:#d4af37;text-align:center;letter-spacing:2px;">¿QUÉ INCLUYE TU TALISMÁN?</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td width="50" valign="top" style="padding-top:2px;font-size:22px;">🔮</td><td style="padding-left:10px;"><p style="margin:0;font-size:14px;font-weight:bold;color:#f0e8ff;">Talismán personalizado</p><p style="margin:4px 0 0;font-size:13px;color:#9d8ab5;line-height:1.7;">Seleccionado según tu energía y la consulta que realizaste en el Oráculo.</p></td></tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td width="50" valign="top" style="padding-top:2px;font-size:22px;">⭐</td><td style="padding-left:10px;"><p style="margin:0;font-size:14px;font-weight:bold;color:#f0e8ff;">Instrucciones de activación</p><p style="margin:4px 0 0;font-size:13px;color:#9d8ab5;line-height:1.7;">Cómo activar su energía bajo la luna y cargarlo para atraer lo que necesitas.</p></td></tr></table>
      <table width="100%" cellpadding="0" cellspacing="0"><tr><td width="50" valign="top" style="padding-top:2px;font-size:22px;">💌</td><td style="padding-left:10px;"><p style="margin:0;font-size:14px;font-weight:bold;color:#f0e8ff;">Acceso a contenido exclusivo</p><p style="margin:4px 0 0;font-size:13px;color:#9d8ab5;line-height:1.7;">Recibirás mis rituales, predicciones y consejos de forma periódica en tu correo.</p></td></tr></table>
    </td>
  </tr>
  <tr>
    <td style="background:#110020;padding:40px;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <h2 style="margin:0 0 25px;font-family:'Georgia',serif;font-size:20px;color:#d4af37;text-align:center;letter-spacing:2px;">¿EN QUÉ PUEDO AYUDARTE?</h2>
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="48%" style="background:#1a0035;border-radius:12px;padding:20px;border:1px solid rgba(212,175,55,0.2);vertical-align:top;"><p style="margin:0 0 8px;font-size:20px;">🃏</p><p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#d4af37;">Tarot Completo</p><p style="margin:0;font-size:12px;color:#9d8ab5;line-height:1.6;">Lectura profunda de tu pasado, presente y futuro.</p></td>
        <td width="4%"></td>
        <td width="48%" style="background:#1a0035;border-radius:12px;padding:20px;border:1px solid rgba(212,175,55,0.2);vertical-align:top;"><p style="margin:0 0 8px;font-size:20px;">⭐</p><p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#d4af37;">Carta Astral</p><p style="margin:0;font-size:12px;color:#9d8ab5;line-height:1.6;">Descubre tu propósito de vida según el cosmos.</p></td>
      </tr><tr><td colspan="3" style="padding:8px 0;"></td></tr><tr>
        <td width="48%" style="background:#1a0035;border-radius:12px;padding:20px;border:1px solid rgba(212,175,55,0.2);vertical-align:top;"><p style="margin:0 0 8px;font-size:20px;">💎</p><p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#d4af37;">Piedras Sagradas</p><p style="margin:0;font-size:12px;color:#9d8ab5;line-height:1.6;">Sanación y equilibrio energético con cristales.</p></td>
        <td width="4%"></td>
        <td width="48%" style="background:#1a0035;border-radius:12px;padding:20px;border:1px solid rgba(212,175,55,0.2);vertical-align:top;"><p style="margin:0 0 8px;font-size:20px;">🌙</p><p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#d4af37;">Consulta Rápida</p><p style="margin:0;font-size:12px;color:#9d8ab5;line-height:1.6;">15 minutos por Bizum · 35€</p></td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="background:#0d001f;padding:40px;text-align:center;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <h3 style="margin:0 0 25px;font-family:'Georgia',serif;font-size:22px;color:#f0e8ff;">El cosmos tiene mensajes para ti</h3>
      <a href="https://paula90146-pixel.github.io/maria-jacaranda-web/#agenda" style="display:inline-block;background:linear-gradient(135deg,#d4af37,#b8962e);color:#000;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">✦ RESERVAR MI CONSULTA ✦</a>
      <br><br>
      <a href="https://wa.me/34602405691" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:12px 30px;border-radius:50px;font-size:13px;font-weight:bold;">💬 WhatsApp 602 405 691</a>
    </td>
  </tr>
  <tr>
    <td style="background:#110020;padding:30px 40px;text-align:center;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <div style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:20px 30px;display:inline-block;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d4af37;">📡 EN DIRECTO</p>
        <p style="margin:0 0 4px;font-size:15px;color:#f0e8ff;font-weight:bold;">Martes y Jueves · 19:00 a 20:00h</p>
        <p style="margin:0;font-size:13px;color:#9d8ab5;">En Instagram y Facebook</p>
      </div>
    </td>
  </tr>
  <tr>
    <td style="background:#0d001f;padding:30px 40px;text-align:center;border-left:1px solid rgba(212,175,55,0.3);border-right:1px solid rgba(212,175,55,0.3);">
      <a href="https://www.instagram.com/mariajacarandaoficial" style="display:inline-block;margin:0 6px;background:linear-gradient(135deg,#e1306c,#833ab4);color:#fff;text-decoration:none;padding:10px 18px;border-radius:25px;font-size:12px;font-weight:bold;">📸 Instagram</a>
      <a href="https://www.facebook.com/mariajacarandaoficial" style="display:inline-block;margin:0 6px;background:#1877f2;color:#fff;text-decoration:none;padding:10px 18px;border-radius:25px;font-size:12px;font-weight:bold;">📘 Facebook</a>
      <a href="https://www.tiktok.com/@maria.jacaranda8" style="display:inline-block;margin:0 6px;background:#010101;color:#fff;text-decoration:none;padding:10px 18px;border-radius:25px;font-size:12px;font-weight:bold;">🎵 TikTok</a>
    </td>
  </tr>
  <tr>
    <td style="background:#030008;padding:30px 40px;text-align:center;border-radius:0 0 20px 20px;border:1px solid rgba(212,175,55,0.3);border-top:none;">
      <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:16px;color:#d4af37;letter-spacing:3px;">MARÍA JACARANDA</p>
      <p style="margin:0 0 16px;font-size:12px;color:#9d8ab5;font-style:italic;">"Tu destino está escrito. Yo te lo leo."</p>
      <p style="margin:0;font-size:10px;color:#4a3a6a;line-height:1.6;">© 2026 María Jacaranda · Todos los derechos reservados<br>Las consultas de videncia son de entretenimiento.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    if (request.method !== 'POST') return new Response('Método no permitido', { status: 405, headers: corsHeaders });

    try {
      const body = await request.json();
      const nombre = body?.nombre?.trim();
      const email = body?.email?.trim();
      const telefono = body?.telefono?.trim();

      if (!nombre || !email) {
        return new Response(JSON.stringify({ error: 'Faltan datos' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 1. Añadir contacto a Brevo
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: nombre, SMS: telefono || '' },
          listIds: [2],
          updateEnabled: true
        })
      });

      // 2. Enviar newsletter de bienvenida
      const htmlPersonalizado = NEWSLETTER_HTML.replace('{{nombre}}', nombre);

      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: 'María Jacaranda', email: 'paula90146@gmail.com' },
          to: [{ email, name: nombre }],
          subject: '✦ Tu Talismán Sagrado te Espera · María Jacaranda',
          htmlContent: htmlPersonalizado
        })
      });

      if (!emailRes.ok) {
        const err = await emailRes.text();
        return new Response(JSON.stringify({ error: 'Error al enviar email', detalle: err }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Error interno' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
