import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

    const supabase = createClient('https://fqmawwzhogveaypwhxmd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbWF3d3pob2d2ZWF5cHdoeG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTM4NjQsImV4cCI6MjAzNzgyOTg2NH0.njz-zhNI6JEK1frjirCEdKjnVRByEUbUyGHeGNrn0G0')

    console.log('Supabase Instance: ', supabase);
    const getLastId = async () => {
        const {data, error} = await supabase
            .from('game')
            .select('*')
            .order('id', {ascending: false})

        if (error) {
            console.error('Error fetching data:', error);
            return null;
        } else {
            console.log('Fetched data:', data);
            return data[0]?.id;   //get the last game id which presents the current game
        }
    };


    const lastId = await getLastId();

    const getResultsById = async (id) => {   //getting results of winner name and points
        const {data, error} = await supabase
            .from('game')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching data:', error);
            return null;
        } else {
            console.log('Fetched data:', data);
            return data;
        }
    };

    if (lastId) {
        const results = await getResultsById(lastId);
        document.addEventListener('resultsLoaded', function() {
            if (results) {
                const winnerTextElement = document.querySelector('.winner-text');
                const pointsNumberElement = document.querySelector('.points-number');

                if (winnerTextElement && pointsNumberElement) {
                    winnerTextElement.textContent = results.winner;
                    pointsNumberElement.textContent = results.points;
                }
            }
        })

        const getLogsByGameId = async (gameId) => {  //getting logs
            const {data, error} = await supabase
                .from('logs')
                .select('*')
                .eq('foreignKey', gameId);

            if (error) {
                console.error('Error fetching logs:', error);
                return null;
            } else {
                console.log('Fetched logs:', data);
                return data;
            }
        };

        const gameLog = await getLogsByGameId(lastId);

        if (gameLog) {

            document.addEventListener('resultsLoaded', function() {

                const gridContainer = document.querySelector('.grid-history-container');

                function createGridItem(text) {
                    const div = document.createElement('div');
                    div.classList.add('grid-item');
                    div.textContent = text;
                    return div;
                }

                gameLog.forEach(entry => {
                    const playerName = createGridItem(entry.playerName);
                    const cardsNumber = createGridItem(entry.cardsNumber);
                    const success = createGridItem(entry.success);

                    gridContainer.appendChild(playerName);
                    gridContainer.appendChild(cardsNumber);
                    gridContainer.appendChild(success);
                });
            })
        }

    } else {
        console.error('No last ID found.');
    }
