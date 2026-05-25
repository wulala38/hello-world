const app = getApp();

Page({
  data: {
    connectionStatus: 'disconnected',
    statusLabel: '未连接',
    connectedDeviceName: '',
    connectedDeviceId: '',
    connectionTime: '',
    isSearching: false,
    devices: [],
    boundDevices: []
  },

  onLoad() {
    this.loadBoundDevices();
    this.checkBluetoothAdapter();
  },

  onShow() {
    this.updateConnectionStatus();
  },

  onUnload() {
    if (this._bluetoothListener) {
      wx.offBluetoothAdapterStateChange(this._bluetoothListener);
    }
  },

  loadBoundDevices() {
    const boundDevices = wx.getStorageSync('boundDevices') || [];
    this.setData({ boundDevices });
  },

  saveBoundDevice(device) {
    let boundDevices = wx.getStorageSync('boundDevices') || [];
    const index = boundDevices.findIndex(d => d.deviceId === device.deviceId);
    
    if (index > -1) {
      boundDevices[index].lastConnectTime = this.formatTime();
    } else {
      boundDevices.push({
        ...device,
        lastConnectTime: this.formatTime()
      });
    }

    wx.setStorageSync('boundDevices', boundDevices);
    this.loadBoundDevices();
  },

  formatTime() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  },

  checkBluetoothAdapter() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        if (!res.available) {
          wx.showModal({
            title: '提示',
            content: '蓝牙不可用，请检查手机蓝牙设置',
            showCancel: false
          });
        }
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '无法获取蓝牙状态，请确保蓝牙功能正常',
          showCancel: false
        });
      }
    });
  },

  updateConnectionStatus() {
    const isConnected = app.globalData.isConnected;
    const deviceId = app.globalData.connectedDeviceId;

    if (isConnected) {
      this.setData({
        connectionStatus: 'connected',
        statusLabel: '已连接',
        connectedDeviceId: deviceId
      });
    } else {
      this.setData({
        connectionStatus: 'disconnected',
        statusLabel: '未连接',
        connectedDeviceId: ''
      });
    }
  },

  startConnection() {
    if (this.data.connectionStatus === 'connecting') {
      return;
    }

    this.setData({
      connectionStatus: 'connecting',
      statusLabel: '正在搜索...',
      isSearching: true,
      devices: []
    });

    this._bluetoothListener = (res) => {
      if (!res.available) {
        this.setData({
          isSearching: false,
          connectionStatus: 'disconnected',
          statusLabel: '蓝牙不可用'
        });
        wx.showToast({
          title: '蓝牙不可用',
          icon: 'none'
        });
      }
    };
    wx.onBluetoothAdapterStateChange(this._bluetoothListener);

    wx.openBluetoothAdapter({
      success: () => {
        this.startSearch();
      },
      fail: (err) => {
        this.setData({
          isSearching: false,
          connectionStatus: 'disconnected',
          statusLabel: '蓝牙初始化失败'
        });
        wx.showModal({
          title: '提示',
          content: '请确保蓝牙功能已开启',
          showCancel: false
        });
      }
    });
  },

  startSearch() {
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      success: () => {
        this._onDeviceFound = (res) => {
          const devices = res.devices.filter(d => d.name || d.localName);
          this.setData({
            devices: devices.map(device => ({
              ...device,
              name: device.name || device.localName || '未知设备',
              connecting: false
            }))
          });
        };
        wx.onBluetoothDeviceFound(this._onDeviceFound);

        setTimeout(() => {
          this.stopSearch();
        }, 10000);
      },
      fail: (err) => {
        this.setData({
          isSearching: false,
          connectionStatus: 'disconnected'
        });
        wx.showToast({
          title: '搜索失败',
          icon: 'none'
        });
      }
    });
  },

  stopSearch() {
    wx.stopBluetoothDevicesDiscovery({
      complete: () => {
        this.setData({
          isSearching: false
        });
      }
    });
    if (this._onDeviceFound) {
      wx.offBluetoothDeviceFound(this._onDeviceFound);
    }
  },

  selectDevice(e) {
    const device = e.currentTarget.dataset.device;
    if (device.connecting || device.connected) {
      return;
    }

    const devices = this.data.devices.map(d => {
      if (d.deviceId === device.deviceId) {
        return { ...d, connecting: true };
      }
      return d;
    });
    this.setData({ devices });

    this.connectToDevice(device);
  },

  connectToDevice(device) {
    wx.showLoading({
      title: '正在连接...',
      mask: true
    });

    wx.createBLEConnection({
      deviceId: device.deviceId,
      timeout: 10000,
      success: () => {
        this.stopSearch();
        
        app.globalData.connectedDeviceId = device.deviceId;
        app.globalData.isConnected = true;
        
        this.saveBoundDevice(device);

        wx.hideLoading();

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        this.setData({
          connectionStatus: 'connected',
          statusLabel: '已连接',
          connectedDeviceName: device.name,
          connectedDeviceId: device.deviceId,
          connectionTime: timeStr,
          devices: []
        });

        wx.showToast({
          title: '连接成功',
          icon: 'success'
        });

        this.getDeviceServices(device.deviceId);
      },
      fail: (err) => {
        wx.hideLoading();
        
        const devices = this.data.devices.map(d => {
          if (d.deviceId === device.deviceId) {
            return { ...d, connecting: false };
          }
          return d;
        });
        this.setData({ devices });

        wx.showToast({
          title: '连接失败',
          icon: 'none'
        });
      }
    });
  },

  getDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('设备服务列表:', res.services);
      }
    });

    wx.onBLEConnectionStateChange((res) => {
      if (!res.connected) {
        app.globalData.isConnected = false;
        app.globalData.connectedDeviceId = null;
        this.setData({
          connectionStatus: 'disconnected',
          statusLabel: '连接已断开'
        });
        this.autoReconnect();
      }
    });
  },

  disconnect() {
    wx.showModal({
      title: '提示',
      content: '确定要断开连接吗？',
      success: (res) => {
        if (res.confirm) {
          wx.closeBLEConnection({
            deviceId: this.data.connectedDeviceId,
            success: () => {
              app.globalData.isConnected = false;
              app.globalData.connectedDeviceId = null;
              
              this.setData({
                connectionStatus: 'disconnected',
                statusLabel: '已断开',
                connectedDeviceName: '',
                connectedDeviceId: '',
                connectionTime: ''
              });

              wx.showToast({
                title: '已断开连接',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  autoReconnect() {
    const boundDevices = wx.getStorageSync('boundDevices') || [];
    if (boundDevices.length > 0) {
      wx.showModal({
        title: '提示',
        content: '检测到已绑定设备，是否自动重连？',
        success: (res) => {
          if (res.confirm) {
            this.reconnectDevice({
              currentTarget: {
                dataset: {
                  device: boundDevices[0]
                }
              }
            });
          }
        }
      });
    }
  },

  reconnectDevice(e) {
    const device = e.currentTarget.dataset.device;
    this.connectToDevice(device);
  },

  refreshDevices() {
    this.startConnection();
  }
});
