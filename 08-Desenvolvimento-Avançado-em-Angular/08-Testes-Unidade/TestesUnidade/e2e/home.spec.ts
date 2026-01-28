import { test, expect } from '@playwright/test';


test.describe('Testes da Página Inicial', () => {

    test('deve exibir uma mensagem na página inicial', async ({ page }) => {
        await page.goto('/');
        
        const titulo = page.getByRole('heading', { level: 1 });
        await expect(titulo)
        .toHaveText('Desenvolvimento Avançado em Angular');
    });

    test.afterEach(async ({ page }) => {
        const erros = [];

        page.on('console', msg => {
        if (msg.type() === 'error') {
            erros.push(msg.text());
        }
        });

        expect(erros).toEqual([]);
    });

});