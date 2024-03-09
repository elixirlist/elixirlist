defmodule ElixirList.Repo do
  use Ecto.Repo,
    otp_app: :elixir_list,
    adapter: Ecto.Adapters.SQLite3
end
