(function() {
    var B = {
        elem: null,
        timer: null,
        getElem: function() {
            if (!this.elem) {
                return (this.elem = $("log-message"))
            }
            return this.elem
        },
        write: function(I, F) {
            if (this.timer) {
                this.timer = clearTimeout(this.timer)
            }
            var H = this.getElem(),
                G = H.style;
            G.height = "2.1em";
            H.textContent = I;
            G.visibility = "visible";
            if (F) {
                this.timer = setTimeout(function() {
                    G.visibility = "hidden";
                    G.height = 0;
                    H.textContent = ""
                }, 5000)
            }
        }
    };

    function E(K) {
        var L = {},
            F, G, J, I, H;
        for (I in K) {
            F = {
                id: I,
                name: I,
                children: []
            };
            J = K[I];
            for (I in J) {
                H = I;
                if (!L.hasOwnProperty(I)) {
                    L[I] = 1
                } else {
                    I = I + L[I]++
                }
                F.children.push({
                    id: I,
                    name: H,
                    children: J[H].map(function(N) {
                        var M = N;
                        if (!L.hasOwnProperty(N)) {
                            L[N] = 1
                        } else {
                            N = N + L[N]++
                        }
                        return {
                            id: N,
                            name: M
                        }
                    })
                })
            }
        }
        return F
    }

    function D(F, G, H) {
        B.write("Loading data...");
        new Request.JSON({
            url: "data/bands/" + G + ".txt",
            onSuccess: function(I) {
                I = E(I);
                H(F, I);
                B.write("Done.", true)
            },
            onFailure: function(I) {
                B.write("There's no entry in the database for " + G + ". Sorry.", true)
            }
        }).get()
    }

    function A(F, G) {
        F.loadJSON(G);
        F.graph.eachNode(function(I) {
            var H = I.getPos();
            H.setc(0, 0)
        });
        F.compute("end");
        F.fx.animate({
            modes: ["polar"],
            duration: 2000,
            hideLabels: true,
            transition: $jit.Trans.Quint.easeInOut
        })
    }

    function C() {
        var F = new $jit.Hypertree({
            injectInto: "tree",
            offset: 0.1,
            Navigation: {
                enable: true,
                panning: true,
                zooming: 10
            },
            Node: {
                overridable: true,
                color: "red",
                dim: 9,
                CanvasStyles: {
                    shadowBlur: 3,
                    shadowColor: "#111"
                }
            },
            Edge: {
                overridable: true,
                color: "#23A4FF",
                lineWidth: 1.8
            },
            onCreateLabel: function(H, G) {
                H.innerHTML = G.name;
                H.onclick = function() {
                    if (!$(H).hasClass("depth0")) {
                        return
                    }
                    D(F, G.name, function(I, J) {
                        J.id = G.id;
                        window.location = "#" + encodeURIComponent(G.name);
                        I.onClick(G.id, {
                            hideLabels: true,
                            onComplete: function() {
                                I.op.morph(J, {
                                    type: "fade",
                                    id: G.id,
                                    duration: 2000,
                                    hideLabels: true
                                })
                            }
                        })
                    })
                }
            },
            onPlaceLabel: function(K, I) {
                var H = K.style;
                H.display = "";
                if (I._depth <= 1) {
                    K.className = "node depth0"
                } else {
                    if (I._depth == 2) {
                        K.className = "node depth2"
                    } else {
                        H.display = "none"
                    }
                }
                var J = parseInt(H.left, 10);
                var G = K.offsetWidth;
                H.left = (J - G / 2) + "px"
            }
        });
        return F
    }
    window.addEvent("domready", function(J) {
        var H = $(document.body),
            G = H.getElement("header"),
            O = H.getElements("nav > ul > li > a"),
            M = $("input-names"),
            N = $("other-select"),
            F = $("artist-names"),
            L = C(),
            K = decodeURIComponent(window.location.hash.slice(1)) || "Metallica",
            I;
        $("toggle").addEvent("click", function(P) {
            P.stop();
            G.toggleClass("hidden");
            this.textContent = "Click here to " + (G.hasClass("hidden") ? "show" : "hide")
        });
        O.addEvent("click", function(R) {
            R.stop();
            var Q = this.textContent,
                P = I.indexOf(Q);
            N.selectedIndex = P;
            M.value = Q;
            window.location = "#" + encodeURIComponent(Q);
            D(L, this.textContent, A)
        });
        N.addEvent("change", function(Q) {
            var P = this.value;
            M.value = P;
            window.location = "#" + encodeURIComponent(P);
            D(L, this.value, A)
        });
        M.addEvent("change", function(R) {
            var Q = this.value,
                P = I.indexOf(Q);
            N.selectedIndex = P;
            window.location = "#" + encodeURIComponent(Q);
            D(L, this.value, A)
        });
        M.addEvent("keyup", function(P) {
            if (P.key == "enter") {
                M.fireEvent("change", P)
            }
        });
        new Request({
            url: "data/list.txt",
            method: "get",
            onSuccess: function(P) {
                I = P.split("\n");
                N.innerHTML = "<option>" + I.join("</option><option>") + "</option>";
                F.innerHTML = N.innerHTML;
                M.value = K;
                M.fireEvent("change")
            },
            onFailure: function() {
                B.write("There was an error while requesting the list of bands.", true)
            }
        }).send();
        window.addEvent("resize", function(P) {
            L.canvas.resize(window.innerWidth, window.innerHeight)
        });
        D(L, K, A)
    })
})();