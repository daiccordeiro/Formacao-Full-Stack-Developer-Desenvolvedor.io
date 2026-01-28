import { expect, test } from '@playwright/test';


test.describe('Testes do Formulário de Cadastro', () => {

    test('deve navegar até formulário de cadastro', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: 'Cadastro' }).click();

        await expect(
        page.getByRole('heading', { level: 4 })
        ).toHaveText('Demo Cadastro');
    });

    test('deve preencher formulário de cadastro com sucesso', async ({ page }) => {
        await page.goto('/cadastro');

        const nome = page.locator('#nome');
        const cpf = page.locator('#cpf');
        const email = page.locator('#email');
        const senha = page.locator('#senha');
        const senhaConfirmacao = page.locator('#senhaConfirmacao');

        await nome.pressSequentially('Daiane Cordeiro', { delay: 80 });
        await cpf.pressSequentially('38572934898', { delay: 80 });
        await email.pressSequentially('teste@teste.com', { delay: 80 });
        await senha.pressSequentially('Teste@123', { delay: 100 });
        await senhaConfirmacao.pressSequentially('Teste@123', { delay: 100 });

        await page.getByRole('button', { name: 'Registrar' }).click();

        await expect(
        page.locator('p').filter({ hasText: '"nome":"Daiane Cordeiro"' })
        ).toBeVisible();
    });

    test('deve validar senhas diferentes', async ({ page }) => {
        await page.goto('/cadastro');

        const nome = page.locator('#nome');
        const cpf = page.locator('#cpf');
        const email = page.locator('#email');
        const senha = page.locator('#senha');
        const senhaConfirmacao = page.locator('#senhaConfirmacao');

        await nome.pressSequentially('Daiane Cordeiro', { delay: 80 });
        await cpf.pressSequentially('38572934898', { delay: 80 });
        await email.pressSequentially('teste@teste.com', { delay: 80 });
        await senha.pressSequentially('Teste@2123', { delay: 100 });
        await senhaConfirmacao.pressSequentially('Teste@123', { delay: 100 });

        await senha.click(); // força blur/focus para disparar validação

        //await page.pause(); // usado apenas na hora de testar (no Terminal: npm run e2e:chrome:headed)
        
        await expect(
        page.getByText('As senhas não conferem')
        ).toBeVisible();
    });
});
