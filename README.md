# Media-scale

Compare an article's visibility on social media to other known events visibility in its local reference media to give some perspective to the number of reactions.

## Motivation, use and purpose

When fighting disinformation, analyses and fact-checks produced often relay - when they are not based on - **figures to measure the impact of a content** on a given society.

Among such data can be the number of reactions to said content, the number of comments it yields, or the number of times it has been shared.

However, this data us usually not **contrasted** nor compared. Rather than focusing on their quantitative aspect, we offer an alternative: to organize data according to a scale of relevance. Thus, in considering the topic of the content instead of how many times it was shared, one reaches a **qualitative scale of reference**.

In a spreadsheet (.csv file), the number of engagements (shares, likes and comments alike) generated by an article is linked to:
- its region or country of origin,
- its source (main national newspapers),
- the date of its publication,
- its topic (title).

Therefore, **quantitative data is both contextualized and put into perspective**, in a **clear and accessible** way.
The comparison can be done manually or with the exposed API.

> Comparez la visibilité d'un article sur les médias sociaux à la visibilité d'un événement connu dans les médias de référence de sa région pour mettre en perspective le nombre de réactions.

> ## Motivation, buts et usages

> Dans le cadre de la lutte contre la désinformation, les analyses et vérifications menées reprennent régulièrement - voire se basent sur - des **données chiffrées pour mesurer l'impact d'un contenu** sur une société. Il peut s'agir par exemple du nombre de réactions à ce contenu, du nombre de commentaires, ou encore du nombre de fois qu'un contenu a été partagé.

> Or, ces données sont rarement **mises en perspective**. Plutôt que de se focaliser sur leur aspect quantitatif, nous proposons de les organiser en fonction d'une échelle de pertinence. Ainsi, en considérant le sujet du contenu plutôt que son nombre de partages, on aboutit à une **échelle de référence qualitative**.

> Sous la forme d'un tableur (fichier au format .csv), le nombre d'engagements (partages, likes et commentaires) suscités par un article est lié à :
> - son pays d'origine,
> - sa source (principaux journaux nationaux),
> - sa date de publication,
> - son sujet (titre).

> Il y a donc une **contextualisation et une mise en perspective de données chiffrées**, facilement **lisibles et accessibles**.

## API

A public test instance is available at [https://disinfo.quaidorsay.fr/api/media-scale/1.0](https://disinfo.quaidorsay.fr/api/media-scale/1.0)

### GET /around

Returns press articles with similar shares number for each major newspaper of the given region

#### Query parameters

| Name  | Required | Description | Example |
| ----- | -------- | ----------- | ------- |
| region | required | The region where article comparison has to be done. Country code in ISO 3166-1 alpha-2 | fr |
| shares | required | The number of shares to compare to. Integer > 0 | 8765 |

#### Example Request

	GET /media-scale/1.0/around?region=fr&shares=150000

#### Example Response

```
{
	"Le Monde": {
		"totalEngagements": "158000",
		"facebook": "148100",
		"twitter": "9600",
		"pinterest": "1",
		"reddit": "273",
		"country": "FR",
		"source": "Le Monde",
		"date": "2017-07-10",
		"title": "La sixième extinction de masse des animaux s’accélère",
		"url": "https://www.lemonde.fr/biodiversite/article/2017/07/10/la-sixieme-extinction-de-masse-des-animaux-s-accelere-de-maniere-dramatique_5158718_1652692.html"
	},
	"Le Figaro": {
		"totalEngagements": "152900",
		"facebook": "152100",
		"twitter": "780",
		"pinterest": "0",
		"reddit": "0",
		"country": "FR",
		"source": "Le Figaro",
		"date": "2018-10-22",
		"title": "Fraude : 1,7 million d'euros d'allocations sociales détournées vers la Roumanie",
		"url": "http://www.lefigaro.fr/social/2018/10/22/20011-20181022ARTFIG00138-un-reseau-detourne-17-million-d-euros-d-allocations-sociales.php"
	},
	…
}
```

- - -

## Development

This API is built with [Node](https://nodejs.org/en/). You will need to [install it](https://nodejs.org/en/download/) to run this API.

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/ambanum/media-scale.git
cd disinformation-encyclopedia
npm install
```

### Usage

Start the server:

```sh
	npm start
```

Then, the previously described API endpoint can be used to programmatically get articles with a comparable visibility.

### Add data for a country

Create a CSV file named with the ISO 3166-1 alpha-2 country code (eg: `dk.csv`) in the `data` folder.

Each row should contains following columns:
- `totalEngagements`: Number of engagements on all social platforms combined
- `facebook`: Number of engagements on Facebook
- `twitter`: Number of engagements on Twitter
- `pinterest`: Number of engagements on Pinterest
- `reddit`: Number of engagements on Reddit
- `country`: Country/Region of the press article
- `source`: Newspaper name
- `date`: Publication date
- `title`: Title of the press article
- `url`: Link to the press article

You can take example from the files already present in the `data` folder.

Then modify the `default.js` config file to add the country in supported countries:

```
supportedCountries: ['fr', 'gb', 'dk'],
```

And specify the path of the data file:

```
dataFilePaths: {
	fr: './data/fr.csv',
	gb: './data/gb.csv',
	dk: './data/dk.csv'
}
```

That's it.

## Deployment

Clone the repository on your server, install dependencies and run the webserver.
We suggest to use a production process manager for Node.js like [pm2](https://github.com/Unitech/pm2) or [Forever](https://github.com/foreversd/forever#readme).

- - -

# License

- The code for this software is distributed under the European Union Public Licence (EUPL) v1.2.

- Data in this repository are distributed under an ODC-BY 1.0 license. That means you are free to share (to copy, distribute and use the database), to Create (to produce works from the database), to Adapt (to modify, transform and build upon the database) as long as you attribute to *Office of the French Ambassador for Digital Affairs*.

Contact the author if you have any specific need or question regarding licensing.
