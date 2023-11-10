// Uses the mapbox library to create an interactive map
class Map {
    constructor(){
        this.mapBox = createDiv();
        this.mapBox.id("map");
        this.mapBox.position(314, 20);
        this.mapBox.size(width,height);

        mapboxgl.accessToken = 'pk.eyJ1Ijoid2FpLXNhbmxlZSIsImEiOiJjbGM3YWwwMTIxMDF2M3ZvOWhjd3Z4Zm4xIn0.ZWM_owHdLThFqnmoCYAg7A';

        this.mapData = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [5, 46],
            zoom: 3
        });
    }
}