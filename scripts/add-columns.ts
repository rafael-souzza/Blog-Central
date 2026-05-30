import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://blog-central-db-rafael-souzza.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjU3MzIsImlkIjoiMDE5ZTZiZDYtMGIwMS03ZjIzLThjOWItZjQzNDY3MGE3NjZiIiwicmlkIjoiZmYzMjdjNDktNGNmZS00YmZjLTk5MjQtZDg4M2RkNjk3NGMzIn0.mZtJcfnWskD51XH5k9iHf9LgbpnW9kZH8DY6W-7mKTjCyLhcfRGCFyMGJFxxubSuNP-ImxAfgWSupHOMSO6aAw',
});

async function main() {
  await client.execute('ALTER TABLE tenants ADD COLUMN logo_url TEXT DEFAULT NULL');
  await client.execute('ALTER TABLE tenants ADD COLUMN font_family TEXT DEFAULT NULL');
  console.log('Colunas adicionadas com sucesso.');
}

main();