import { test, expect } from '@playwright/test'

test.describe('Fluxo de autenticação', () => {
  const user = {
    nome: 'Teste Usuário',
    email: `teste${Date.now()}@exemplo.com`,
    senha: '12345678'
  }

  test('Cadastro de novo usuário', async ({ page }) => {
    await page.goto('http://localhost:3000/cadastro-usuario')

    await page.fill('input[name="nome"]', user.nome)
    await page.fill('input[name="email"]', user.email)
    await page.fill('input[name="senha"]', user.senha)
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Usuário criado com sucesso')).toBeVisible()
  })

  test('Login inválido com senha errada', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', user.email)
    await page.fill('input[name="senha"]', 'senhaErrada')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Credenciais inválidas')).toBeVisible()
  })

  test('Login válido com redirecionamento', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('input[name="email"]', user.email)
    await page.fill('input[name="senha"]', user.senha)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('text=Bem-vindo')).toBeVisible()
  })
})
