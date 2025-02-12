
describe('Technical Test Parkee - API', () => {
    const endpoint = 'https://api.api-onepiece.com/v2/characters/en';

    it('Validates the API response status code is 200', () => {
        cy.request(endpoint).then((response) => {
            expect(response.status, 'Status code should be 200').to.eq(200);
        });
    });

    it('Validates each character ID is unique', () => {
        cy.request(endpoint).then((response) => {
            const datas = response.body;
            const ids = new Set();

            datas.forEach((data) => {
                expect(ids.has(data.id), `Duplicate ID found: ${data.id}`).to.be.false;
                ids.add(data.id);
            });
        });
    });

    it('Validates that "Gum-Gum Fruit" is exclusive to Monkey D. Luffy', () => {
        cy.request(endpoint).then((response) => {
          const datas = response.body;
      
          datas.forEach((data) => {
            
            if (data.fruit === 'Gum-Gum Fruit') {
              expect(data.name, 'Gum-Gum Fruit should belong to Monkey D. Luffy').to.eq('Monkey D. Luffy');
            }
      
            if (data.fruit === 'Gum-Gum Fruit' && data.name !== 'Monkey D. Luffy') {
              expect(data.name,`Invalid character with Gum-Gum Fruit: ${data.name}`).to.not.be.oneOf(['Zoro', 'Sanji', 'Nami', 'Other Characters']);
            }
          });
        });
    });

    it('Validates "total_prime" matches the sum of "bounty" for each crew ID', () => {
        cy.request(endpoint).then((response) => {
            const datas = response.body;
            const crews = new Map();
      
            datas.forEach((data) => {
                if (!data.crew_id) return;
      
                if (!crews.has(data.crew_id)) {
                    crews.set(data.crew_id, { bounty: 0, total_prime: 0 });
                }
      
                const crewData = crews.get(data.crew_id);
                crewData.bounty += data.bounty || 0;
                crewData.total_prime = data.total_prime || crewData.total_prime; 
            });
      
            crews.forEach((crewData, crewId) => {
                expect(crewData.total_prime, `Total prime mismatch for crew ID ${crewId}: Expected ${crewData.total_prime} to equal ${crewData.bounty}`).to.eq(crewData.bounty);
                if (crewData.total_prime !== crewData.bounty) {
                    expect(crewData.total_prime,`Mismatch found: Crew ID ${crewId}, Total Prime: ${crewData.total_prime}, Calculated Bounty: ${crewData.bounty}`).to.not.eq(crewData.total_prime);
                }
            });
        });
    });
});