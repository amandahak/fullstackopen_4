# Full Stack Open 4:n osan -repository

* [Linkki kurssialustalle](https://fullstackopen.com/)
* [Kurssin 0. 1. ja 2. osuuksien repository](https://github.com/amandahak/fullstackopen_ah)
* [3. osan frontendin repository](https://github.com/amandahak/fullstackopen_3_frontend)
* [3. osan backendin repository](https://github.com/amandahak/fullstackopen_3_backend)
* [render-sivusto](https://fullstackopen-3-ves5.onrender.com)

Kurssilla tutustutaan JavaScriptilla tapahtuvaan moderniin web-sovelluskehitykseen. 
Pääpaino on React-kirjaston avulla toteutettavissa single page ‑sovelluksissa ja niitä tukevissa Node.js:llä toteutetuissa REST- ja GraphQL-rajapinnoissa. 
Kurssi sisältää myös osat, joissa tutustutaan TypeScriptiin, React Nativeen ja jatkuvaan integraatioon.

Kurssilla käsitellään myös sovellusten testaamista, konttiteknologiaa, konfigurointia ja suoritusympäristöjen hallintaa sekä tietokantoja.

## Osa 4

### Osa-alueet  

* Sovelluksen rakenne ja testauksen alkeet
* Backendin testaaminen (yksikkö ja integraatiotestaaminen)
* Käyttäjien hallinta
* Token-perustainen kirjautuminen
* Legacy: Testaaminen Jestiä käyttäen


## Blogilistasovelluksen Backend

Tämä on Node.js- ja Express-pohjainen sovellus, joka tarjoaa toiminnallisuuden blogien hallintaan. Sovellus mahdollistaa blogien lisäämisen, poistamisen, päivittämisen ja listaamisen. Lisäksi se tukee käyttäjien hallintaa ja token-pohjaista autentikointia.

### Ominaisuudet

- **Blogien hallinta :** 

    - Listaa kaikki blogit
    - Lisää uusi blogi
    - Päivitä blogin tykkäykset
    - Poista blogi

- **Käyttäjien hallinta:**

    - Luo uusia käyttäjiä
    - Listaa kaikki käyttäjät
    - Näytä käyttäjien lisäämät blogit

- **Token-pohjainen autentikointi:** 

    - Käyttäjät kirjautuvat järjestelmään ja saavat tokenin, jota käytetään suojattuihin operaatioihin.
    - Vain kirjautuneet käyttäjät voivat lisätä tai poistaa blogeja.


### Käyttöönotto

1. **Asenna riippuvuudet:**

    ```bash
    npm install
    ```

2. **Käynnistä palvelin:**

    ```bash
    npm start
    ```

3. **Käytä kehitystilaa:**

    ```bash
    npm run dev
    ```

    Dev-käyttötilassa palvelin käynnistyy uudelleen automaattisesti koodimuutosten jälkeen.

4. **Ympäristömuuttujat**
Luo .env-tiedosto projektin juureen ja määritä seuraavat arvot:

    ```bash
    MONGODB_URI=<MongoDB Atlas URI>
    SECRET=<JWT salainen avain>
    ```


### API-reitit

**Blogit** (/api/blogs)
- **GET**: Listaa kaikki blogit. Esimerkki:

```bash
curl http://localhost:3003/api/blogs
```

- **POST**: Lisää uusi blogi. Vain kirjautuneet käyttäjät voivat lisätä blogeja. Esimerkki:

```bash
curl -X POST http://localhost:3003/api/blogs -H "Authorization: Bearer <token>" -d '{"title":"Uusi Blogi","author":"Kirjoittaja","url":"http://example.com"}'
```
- **PUT**: Päivittää blogin tykkäykset. Esimerkki:

```bash
curl -X PUT http://localhost:3003/api/blogs/<id> -d '{"likes":10}'
```

- **DELETE**: Poistaa blogin. Vain blogin lisääjä voi poistaa sen. Esimerkki:

```bash
curl -X DELETE http://localhost:3003/api/blogs/<id> -H "Authorization: Bearer <token>"
```

**Käyttäjät** (/api/users)

- **GET**: Listaa kaikki käyttäjät.

- **POST**: Luo uusi käyttäjä. Esimerkki:
```bash
curl -X POST http://localhost:3003/api/users -d '{"username":"uusi_käyttäjä","password":"salasana","name":"Nimi"}'
```

**Kirjautuminen** (/api/login)

- **POST**: Kirjautuminen ja tokenin saaminen. Esimerkki:
```bash
curl -X POST http://localhost:3003/api/login -d '{"username":"testuser","password":"salasana"}'
```

### Testaus

**Suorita testit:**
```bash
npm test
```

Testit kattavat seuraavat asiat:

- Blogien listaaminen, lisääminen ja poistaminen
- Käyttäjien lisääminen
- Autentikoinnin toimivuus

### Tietokanta
Sovellus käyttää MongoDB:tä tietojen tallentamiseen. 


### Huomioitavaa

Sovelluksessa käytetään jsonwebtoken-kirjastoa token-pohjaiseen autentikointiin.
Kaikki suojatut operaatiot edellyttävät voimassaolevaa tokenia, joka lähetetään Authorization-headerissa muodossa Bearer <token>.