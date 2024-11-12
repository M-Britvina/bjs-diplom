"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
	ApiConnector.logout(response => {
		if (response.success) {
			location.reload();
		}
	});
}

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();

function updateStocks() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}

updateStocks();

setInterval(() => updateStocks(), 60000);

const moneyManager = new MoneyManager();

function processResponseForMoneyManager(response) {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
		moneyManager.setMessage(response.success, "Запрос выполнен успешно");
	} else {
		moneyManager.setMessage(response.success, response.error);
	}
}

moneyManager.addMoneyCallback = data => {
	ApiConnector.addMoney(data, processResponseForMoneyManager);
}

moneyManager.conversionMoneyCallback = data => {
	ApiConnector.convertMoney(data, processResponseForMoneyManager);
}

moneyManager.sendMoneyCallback = data => {
	ApiConnector.transferMoney(data, processResponseForMoneyManager);
}

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	} else {
		favoritesWidget.setMessage(response.success, response.error);
	}
});

function processResponseForFavoritesWidget(response) {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
		favoritesWidget.setMessage(response.success, "Запрос выполнен успешно");
	} else {
		favoritesWidget.setMessage(response.success, response.error);
	}
}

favoritesWidget.addUserCallback = data => {
	ApiConnector.addUserToFavorites(data, processResponseForFavoritesWidget);
}

favoritesWidget.removeUserCallback = data => {
	ApiConnector.removeUserFromFavorites(data, processResponseForFavoritesWidget);
}