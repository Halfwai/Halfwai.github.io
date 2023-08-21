// populate image gallery from /images/gallery folder using handlebars template. To add more images add an image object to the images array with file location and 
// appropriate alt text
const imageArray = [{
    location: 'images/gallery/pangolin1.webp',
    altText: 'Wai Lee singing into a microphone from his left hand side'
},
{
    location: 'images/gallery/pangolin2.webp',
    altText: 'Wai Lee singing into a microphone from his right hand side'
},
{
    location: 'images/gallery/pangolin3.webp',
    altText: 'Wai Lee singing into a microphone with Mark Darvill playing guitar in the background'
},
{
    location: 'images/gallery/pangolin4.webp',
    altText: 'Silhouette of Joe Reader playing the bass guitar and Moshe Forster playing drums in the background'
},
{
    location: 'images/gallery/pangolin5.webp',
    altText: 'Pangolin on stage over the heads of audience members'
},
{
    location: 'images/gallery/pangolin6.webp',
    altText: 'Wai Lee playing guiter behind a microphone'
},
{
    location: 'images/gallery/pangolin7.webp',
    altText: 'Wai Lee singing into a microphone while playing a bar chord, with Mark Darvill in the background'
},
{
    location: 'images/gallery/pangolin8.webp',
    altText: 'Wai Lee and Mark Darvill both singing and playing guitar'
},
{
    location: 'images/gallery/pangolin9.webp',
    altText: 'Joe Reader playing the bass guiter'
},
{
    location: 'images/gallery/pangolin10.webp',
    altText: 'Wai Lee singing, with Joe Reader playing bass behind him'
},
{
    location: 'images/gallery/pangolin11.webp',
    altText: 'Wai Lee singing while looking at his guiter with Joe Reader in the background playing bass'
},
{
    location: 'images/gallery/pangolin12.webp',
    altText: 'Wai Lee singing into a microphone'
},
{
    location: 'images/gallery/pangolin13.webp',
    altText: 'Wai Lee singing into a microphone with eyes closed'
},
{
    location: 'images/gallery/pangolin14.webp',
    altText: 'Moshe Forster playing the drums'
},
{
    location: 'images/gallery/pangolin15.webp',
    altText: 'Wai Lee standing in front of the microphone with Mark Darvill in the background'
},
{
    location: 'images/gallery/pangolin16.webp',
    altText: 'Wai Lee singing into a microphone while playing a bar chord'
},
{
    location: 'images/gallery/pangolin17.webp',
    altText: 'Wai Lee playing guiter with silhouette of Joe Reader to his right'
},
{
    location: 'images/gallery/pangolin18.webp',
    altText: 'Wai Lee landing from jumping and playing guiter'
},
{
    location: 'images/gallery/pangolin19.webp',
    altText: 'Wai Lee playing guitar with Moshe Forster in the background on drums'
},
{
    location: 'images/gallery/pangolin20.webp',
    altText: 'Wai Lee shouts into the microphone'
},
{
    location: 'images/gallery/pangolin21.webp',
    altText: 'Wai Lee adjusts the tone on his guitar'
},
{
    location: 'images/gallery/pangolin22.webp',
    altText: 'Pangolin on stage under a red light'
},
{
    location: 'images/gallery/pangolin23.webp',
    altText: 'Wai Lee singing into a microphone under a red light'
},
{
    location: 'images/gallery/pangolin24.webp',
    altText: 'Wai Lee singing and playing the guitar under a red light'
},
{
    location: 'images/gallery/pangolin25.webp',
    altText: 'Wai Lee singing into a microphone with Moshe Forster in the background, under a red light'
},
{
    location: 'images/gallery/pangolin26.webp',
    altText: 'Wai Lee sings into a micrphone and Moshe Forster plays the drums behind him'
},
{
    location: 'images/gallery/pangolin27.webp',
    altText: 'Wai Lee looks at his guitar as he plays it with Moshe Forster and Mark Darvil behind him'
},
{
    location: 'images/gallery/pangolin28.webp',
    altText: 'Wai Lee shouts into a microphone while playing a bar chord'
},
{
    location: 'images/gallery/pangolin29.webp',
    altText: 'Wai Lee and Moshe Forster playing under a sign saying "Revolver"'
},
{
    location: 'images/gallery/pangolin30.webp',
    altText: 'Close up of Wai Lee singing into a microphone'
},
{
    location: 'images/gallery/pangolin31.webp',
    altText: 'Wai Lee singing into a microphone whith eyes shut, this Moshe Forster playing drums behind him'
},
{
    location: 'images/gallery/pangolin32.webp',
    altText: 'Wai Lee singing into a microphone with Mosh Forster playing drums behind him, under a red light'
},
{
    location: 'images/gallery/pangolin33.webp',
    altText: 'Silhouette of Mark Darvill playing guiter in front of Moshe Forster playing the drums'
},
{
    location: 'images/gallery/pangolin34.webp',
    altText: 'Mark Darvill playing guiter under a red light'
},
{
    location: 'images/gallery/pangolin35.webp',
    altText: 'Wai Lee smiles at his guitar while playing it'
},
{
    location: 'images/gallery/pangolin36.webp',
    altText: 'Wai Lee singing into a microphone and playing guiter'
},
{
    location: 'images/gallery/pangolin37.webp',
    altText: 'Moshe Forster smiles and plays drums, and Wai lee looks down at his guitar as he plays it'
},
{
    location: 'images/gallery/pangolin38.webp',
    altText: 'Silhouette of Wai Lee playing guitar and Moshe Forster playing drums'
},
{
    location: 'images/gallery/pangolin39.webp',
    altText: 'Wai Lee closes his eys and shouts into a microphone'
},
{
    location: 'images/gallery/pangolin40.webp',
    altText: 'Wai Lee sings in the foreground while Mark Darvill plays guitar in the background'
},
{
    location: 'images/gallery/pangolin41.webp',
    altText: 'Wai Lee faces Mark Darvil as both play guitar'
},
{
    location: 'images/gallery/pangolin42.webp',
    altText: 'Wai Lee looks up while singing into a microphone and playing guitar'
},
{
    location: 'images/gallery/pangolin43.webp',
    altText: 'Wai Lee sings into a microphone and looks at his guitar, while Mark Darvill plays guitar in the background'
},
{
    location: 'images/gallery/pangolin44.webp',
    altText: 'Mark Darvill plays a guitar solo'
},
{
    location: 'images/gallery/pangolin45.webp',
    altText: 'Mark Darvill plays a guitar solo under a red light'
},
{
    location: 'images/gallery/pangolin46.webp',
    altText: 'Wai Lee sings into a microphone under a red light, with Moshe Forster in the background'
},
{
    location: 'images/gallery/pangolin47.webp',
    altText: 'Pangolin on stage over the heads of the audience'
},
{
    location: 'images/gallery/pangolin48.webp',
    altText: 'Pangolin on stage over the heads of the audience as Wai Lee shouts'
},
{
    location: 'images/gallery/pangolin49.webp',
    altText: 'Pangolin on stage over the heads of the audience as Wai Lee shouts and crowd members raise their hands'
},
{
    location: 'images/gallery/pangolin50.webp',
    altText: 'Pangolin on stage over the heads of the audience with one audience members raised hand lighted'
},
{
    location: 'images/gallery/pangolin51.webp',
    altText: 'Pangolin on stage over the heads of the audience inder a light blue light'
},
{
    location: 'images/gallery/pangolin52.webp',
    altText: 'Pangolin on stage over the heads of the audience members clap'
},
{
    location: 'images/gallery/pangolin53.webp',
    altText: 'Pangolin on stage over the heads of the audience as Joe Reader looks at Mark Darvil'
},
{
    location: 'images/gallery/pangolin54.webp',
    altText: 'Pangolin on stage over the heads of the audience and Moshe Forster make rock bullhorns with hands'
},
];

// fill out the image gallery template
const galleryTemplate = Handlebars.compile(document.querySelector('#imagestemplate').innerHTML);
const filledGallery = galleryTemplate(imageArray);
document.querySelector('#imagecontainer').innerHTML = filledGallery;

// listens for when images are clicked on, and shows a hidden div containing the image when this event occurs. 
const picContainer = document.querySelector('#bigpiccontainer');
document.querySelectorAll('.gallerypic').forEach((pic) => {
    pic.addEventListener('click', () => {
        if (picContainer.style.display === '' || picContainer.style.display === 'none'){
            const fullsize = document.createElement('img');
            fullsize.alt = pic.alt;
            fullsize.src = pic.src;
            fullsize.className = "bigpic";                 
            picContainer.style.display = 'block';
            picContainer.insertBefore(fullsize, picContainer.firstChild);
        }
    });
});

// Closes the large picture and removes it when the #closepic icon is clicked
document.querySelector('#closepic').addEventListener('click', () => {
    picContainer.removeChild(picContainer.firstChild);
    picContainer.style.display = 'none';
});