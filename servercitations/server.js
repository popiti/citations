import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import passport from 'passport';
import passportd from 'passport-discord';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
import { PaginatedEmbed } from 'embed-paginator'
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
require('dotenv').config()

const app= express();
app.use(cors());
const corsOptions = {
    origin: 'http://localhost:3000', // URL application React.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));
app.use(express.json())

const db= mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "citations"
});

app.get('/',(req, res) => {
    const sql = "SELECT * FROM citation LIMIT 3";
    db.query(sql,(err, result)=>{
      if (err) { throw err; }
      return res.json(result);
  })
});

function tokenLogin() {
  const sql = "SELECT COUNT(*) as nb FROM connexion WHERE userID=?";
  db.query(sql,[userId],(err, result)=>{
    if (err) { throw err; }
    if (result[0].nb > 0)
    {
      const updSql = "UPDATE connexion SET token=? WHERE userID=?"
      db.query(updSql,[jwtToken,userId],(err, result)=>{
        if (err) { throw err; }
      })
    }
    else 
    {
      const insSql = "INSERT INTO connexion VALUES (?, ?)";
      db.query(insSql,[userId,jwtToken],(err, result)=>{
        if (err) { throw err; }
      })
    }
  })
}

app.get('/veriftoken',(req,res)=>{
  if(userId!=null)
  {  
    const sql = "SELECT token FROM connexion WHERE userID=?";
    db.query(sql,[userId],(err, result)=>{
      if (err) { throw err; }
      verifToken = verifyJWT(result[0]['token']);
    })
  }
  console.log(userId);
  return res.json(verifToken);
})

app.get('/list',(req, res) => {
    if(userId==null)
    {
      const sql = "SELECT * FROM citation";
      db.query(sql,(err, result)=>{
        if (err) { throw err; }
        return res.json(result);
    })
    }
    else // Si le user est connecté on récupère les citations qui ont été mis en favori aussi.
    {    
      const sql = "SELECT c.id AS id, c.clientId, c.username AS username, c.contenu AS contenu, c.date AS date, COUNT(f.citationId) AS nbr FROM citation c LEFT JOIN ( SELECT citationId FROM favori WHERE clientId=?) f on c.id=f.citationId GROUP BY c.id, c.contenu, c.date, c.username";   
        db.query(sql,[userId],(err, result)=>{
        if (err) { throw err; }
        return res.json(result);
        })
      }
});

app.get('/listUser',(req, res) => {
  const sql = "SELECT * FROM client WHERE NOT userID=? ";
  db.query(sql,[userId],(err, result)=>{
      if (err) { throw err; }
      return res.json(result);
  })
});

app.get('/listfavori',(req, res) => {
  const sql = "SELECT citation.id as id,username,contenu,date FROM citation,favori WHERE citation.id = favori.citationId AND favori.clientId=?";
  db.query(sql,[userId],(err, result)=>{
      if (err) { throw err; }
      return res.json(result);
  })
});


app.post('/ajoutcitation',(req, res) => {
    let dateNow = new Date().toJSON().slice(0,10);
    const sql= "INSERT INTO citation (`contenu`,`clientId`,`date`,`username`) VALUES (?)";
    const values =[
        req.body.contenu,
        userId,
        dateNow,
        discordName
    ]
    db.query(sql, [values],(err, result)=>{
        if (err) return res.json(err);
        return res.json(result)
    })
});

app.get('/read/:id',(req, res) => {
    const sql= "SELECT * FROM citation WHERE ID=?";
    const id=req.params.id;
    db.query(sql,[id],(err, result)=>{
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
});

app.delete('/deletefavori/:id',(req, res) => {
  const sql= "DELETE FROM favori WHERE citationId=? AND clientId=?";
  const id=req.params.id;
  db.query(sql,[id,userId],(err, result)=>{
      if (err) return res.json({Message: "Error inside server"});
      return res.json(result)
  })
});

app.put('/edit/:id',(req, res) => {
    const sql= "UPDATE student SET `Name`=?,`Email`=? WHERE ID=?";
    const id=req.params.id;
    db.query(sql,[req.body.name, req.body.email, id],(err, result)=>{
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
});

app.post('/ajoutfavori/:id',(req, res) => {
  const sql= "INSERT INTO favori (`citationid`,`clientId`) VALUES (?)";
  const id=req.params.id;
  const values =[
    id,
    userId
] 
    db.query(sql,[values],(err, result)=>{
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })

});

app.delete('/deleteCitation/:id', (req, res) => {
  const sql = "DELETE FROM citation WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
      if (err) return res.json({ Message: "Error inside server" });
      return res.json(result);
  });
});

app.post('/logout-user/:iduser', (req, res) => {
  const useridToLogout = req.params.iduser;

  // Vérifie si l'utilisateur à déconnecter existe et est différent de l'utilisateur actuel
  if (useridToLogout && useridToLogout !== userId) {
      // Utilisation de la méthode destroy de Passport pour déconnecter l'utilisateur
          const sql = "DELETE FROM connexion WHERE userID = ?";
          db.query(sql, [useridToLogout], (err, result) => {
            if (err) return res.json({ Message: "Error inside server" });
        });
          res.json({ message: `Utilisateur ${useridToLogout} déconnecté avec succès` });
      };
});


const DiscordStrategy=passportd.Strategy;
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: false,
  }));
  // Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
// Configure Discord strategy
let userId;
let discordName;
let jwtToken="a";
let verifToken;

passport.use(new DiscordStrategy({
    clientID: '1189555662422814750',
    clientSecret: 'ZBpSq-q-iXT9HcPRFdd0ri7mPzmyQrCM',
    callbackURL: 'http://localhost:8081/auth/discord/callback', // URL de notre serveur
    scope: ['identify'],
  }, (accessToken, refreshToken, profile, done) => {
    // Stockez les informations de l'utilisateur dans la session
    userId = profile.id;
    discordName = profile.username;
    // Vérifie si le client est déjà dans la table `client`
    const checkClientQuery = "SELECT * FROM client WHERE username = ?";
    db.query(checkClientQuery, [discordName], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            // Si le client n'est pas déjà dans la table `client`, ajoutez-le
            const addClientQuery = "INSERT INTO client (`username`, `isAdmin`, `userID`) VALUES (?, ?, ?)";
            db.query(addClientQuery, [discordName, false, userId], (err, result) => {
                if (err) throw err;
                console.log(`Client ${discordName} ajouté à la table 'client'.`);
            });
        }

        // Récupérez la valeur d'isAdmin après la vérification
        const isAdmin = result.length === 0 ? false : result[0].isAdmin;

        // Objet user qu'on envoie à la session
        const user = {
            id: userId,
            username: discordName,
            isAdmin: isAdmin,
            discriminator: profile.discriminator,
        };
    tokenLogin();
    jwtToken = generateJWT(userId);
    // Stockage des informations de l'utilisateur dans la session
    done(null, user);
  })
}));

  function generateJWT(user) {
    const payload = {
      sub: user,
      exp: Math.floor(Date.now() / 1000) + (180), // 180 secondes
    };
  
    return jwt.sign(payload, 'votre_clé_secrète');
  };
  
  // Fonction pour vérifier et décoder un JWT
  function verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, 'votre_clé_secrète');
      return decoded;
    } catch (error) {
      return null; // Token invalide ou expiré
    }
  };
// Authentification d'une route
app.get('/auth/discord', passport.authenticate('discord'));


// Callback après l'authentification Discord
app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) =>res.redirect('http://localhost:3000/'));

// Route pour vérifier l'état de connexion
app.get('/auth/check', (req, res) => {
  res.json({ user: req.isAuthenticated() ? req.user : null });
});

// Déconnexion
app.post('/logout', (req, res) => {
    // Utilisez la méthode logout avec une fonction de rappel
    req.logout((err) => {
      if (err) {
        console.error('Erreur lors de la déconnexion :', err);
        return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
      }
      userId = null;
      jwtToken = "a";
      verifToken = null;
      console.log("Deconnexion reussi");
      // La déconnexion a réussi
      res.json({ success: true });
    });
  });
app.get('/api/user', (req, res) => {
    res.json({ user: req.isAuthenticated() ? req.user : null });
  });

  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });
  const commands = [
    {
      name: 'wbh-list',
      description: 'Fournit la liste de toutes les citations disponibles',
    },
    {
      name: 'wbh-listuser',
      description: 'Fournit la liste de toutes les citations disponibles d\'un utilisateur',
      options: [
        {
          name:'targetuser',
          description: 'L\'utilisateur concerné',
          type: 6,
          required: true,
        }
      ]
    },
    {
      name: 'wbh-favori',
      description: 'Fournit la liste de tes citations favoris',
    },
    {
      name: 'wbh-addc',
      description: 'Permet d\'ajouter une citation',
      options: [
        {
          name:'content',
          description: 'Contenu à remplir',
          type: 3,
          required: true,
        }
      ]
    },
  ];
  
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN_SECRET);
  
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands('1189555662422814750'), {
        body: commands,
      });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();



  client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
  });
  
  const PREFIX = '/';

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Some title')
        .setDescription('Some description here')
        .addFields(
          { name: 'Regular field title', value: 'Some value here' },
          { name: 'Inline field title', value: 'Some value here', inline: true },
          { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        .setTimestamp()
      message.channel.send({ embeds: [exampleEmbed] });
    }
    else if (interaction.commandName === "wbh-list")
    {
      const sql = "SELECT * FROM citation";
      db.query(sql,(err, result)=>{
        if (err) { throw err; }
        const exampleEmbed = new PaginatedEmbed({
          itemsPerPage: 10,
          paginationType: 'field',
          showFirstLastBtns: false
        })
        .setDescriptions(['Citations']);
        let tmp = [];
        for(const i in result)
        {
          tmp.push({name: '\n', value: '"' + result[i].contenu +'"' + ' --- ' + result[i].username });
        }
        exampleEmbed
        .setFields(tmp);
       exampleEmbed.send({ options: { interaction : interaction } });
    })
    
    }
    else if (interaction.commandName === "wbh-addc")
    {
      let dateNow = new Date().toJSON().slice(0,10);
      const sql= "INSERT INTO citation (`contenu`,`clientId`,`date`,`username`) VALUES (?)";
      const values =[
          interaction.options.getString('content'),
          interaction.user.id,
          dateNow,
          interaction.user.username
      ]
      db.query(sql, [values],(err, result)=>{
          if (err) return result.json(err);
          interaction.reply("La citation a été ajouté avec succès");
      })
    }
    else if (interaction.commandName === "wbh-favori" )
    {
      const sql = "SELECT username,contenu,date FROM citation,favori WHERE citation.id = favori.citationId AND favori.clientId=?";
      db.query(sql,[interaction.user.id],(err, result)=>{
        if (err) { throw err; }
        const exampleEmbed = new PaginatedEmbed({
          itemsPerPage: 10,
          paginationType: 'field',
          showFirstLastBtns: false
        })
        .setDescriptions(['Mes favoris']);
        let tmp = [];
        for(const i in result)
        {
          tmp.push({name: '\n', value: '"' + result[i].contenu +'"' + ' --- ' + result[i].username });
        }
        exampleEmbed
        .setFields(tmp);
        exampleEmbed.send({ options: { interaction : interaction } });
      })
    }
    else if (interaction.commandName === "wbh-listuser" )
    {
      const argc = interaction.options.getUser('targetuser').id;
      const sql = "SELECT * FROM citation WHERE clientId=?";
      db.query(sql,[argc],(err, result)=>{
        if (err) { throw err; }
        const exampleEmbed = new PaginatedEmbed({
          itemsPerPage: 10,
          paginationType: 'field',
          showFirstLastBtns: false
        })
        .setDescriptions(['Citations']);
        let tmp = [];
        for(const i in result)
        {
          tmp.push({name: '\n', value: '"' + result[i].contenu +'"' + ' --- ' + result[i].username });
        }
        exampleEmbed
        .setFields(tmp);
       exampleEmbed.send({ options: { interaction: interaction  } });
    })
    }
});
  
  client.login(process.env.TOKEN_SECRET);
  
  app.listen(8081, ()=>{
      console.log("listening");
  })